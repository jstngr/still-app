import React, { createContext, useState, ReactNode, useContext, useMemo, useEffect } from 'react';
import { IBoob, IFeedingEntry } from 'shared/types/types';
import FeedingEntry from '../classes/feeding-entry.class';
import mockData from './mock-data';
import { useDisclosure } from '@mantine/hooks';
import { useSQLiteContext } from './sqlite/sqlite-provider';
import {
  addFeedingEntryToDB,
  deleteFeedingEntryFromDB,
  getFeedingsFromDB,
  initFeedingDB,
  updateFeedingEntryInDB,
} from './sqlite/feeding-database.helpers';

interface IFeedingContextType {
  activeFeeding?: IFeedingEntry;
  feedingEntries: IFeedingEntry[];
  startFeeding: (boob: IBoob) => void;
  stopFeeding: () => void;
  pauseFeeding: () => void;
  continueFeeding: () => void;
  switchBoob: () => void;
  boobSwitchModal: {
    boobSwitchModalOpened: boolean;
    openBoobSwitchModal: () => void;
    closeBoobSwitchModal: () => void;
  };
}

const FeedingContext = createContext<IFeedingContextType | undefined>(undefined);

interface IFeedingProviderProps {
  children: ReactNode;
}

export const FeedingProvider: React.FC<IFeedingProviderProps> = ({ children }) => {
  const [feedingEntries, setFeedingEntries] = useState<IFeedingEntry[]>(mockData);
  const [activeFeeding, setActiveFeeding] = useState<IFeedingEntry>();
  const [boobSwitchModalOpened, { open: openBoobSwitchModal, close: closeBoobSwitchModal }] =
    useDisclosure(false);
  const { db, sqlReady } = useSQLiteContext();

  useEffect(() => {
    async function loadData() {
      await initFeedingDB(db);
      const data = await getFeedingsFromDB(db);
      setFeedingEntries(data);
      if (!data[0]?.stopped) {
        setActiveFeeding(data[0]);
      }
    }

    loadData();
  }, [sqlReady]);

  const updateFeedingEntry = async (updateWith: FeedingEntry) => {
    setFeedingEntries((current) =>
      current.map((entry) => {
        if (entry.id === updateWith.getId()) {
          return updateWith.toObject();
        }
        return entry;
      })
    );
    if (db) {
      await updateFeedingEntryInDB(db, updateWith.toObject());
    }
  };

  const stopFeeding = async () => {
    if (!activeFeeding) {
      return;
    }
    const currentFeeding = new FeedingEntry(activeFeeding);
    currentFeeding.stop();
    if (currentFeeding.getDuration() < 2000) {
      setFeedingEntries((current) => current.filter(({ id }) => id !== currentFeeding.getId()));
      if (db) {
        await deleteFeedingEntryFromDB(db, currentFeeding.toObject());
      }
    } else {
      updateFeedingEntry(currentFeeding);
    }
    setActiveFeeding(undefined);
  };

  /**
   *
   * @param boob Boob side to switch to
   * @param force Boolean to indicate if it should check for boob switch
   * @returns void
   */
  const startFeeding = async (boob: IBoob, force?: boolean) => {
    if (activeFeeding && !force) {
      openBoobSwitchModal();
      return;
    }
    stopFeeding();
    const newFeeding = new FeedingEntry({ boob });
    if (db) {
      const id = await addFeedingEntryToDB(db, newFeeding.toObject());
      if (id) {
        newFeeding.setId(id);
      }
    }
    setActiveFeeding(newFeeding.toObject());
    setFeedingEntries((current) => [newFeeding.toObject(), ...current]);
  };

  const switchBoob = () => {
    const currentBoob = activeFeeding?.boob;
    if (currentBoob === 'Left') {
      startFeeding('Right', true);
    } else {
      startFeeding('Left', true);
    }
  };

  const continueFeeding = () => {
    if (!activeFeeding) {
      return;
    }
    const currentFeeding = new FeedingEntry(activeFeeding);
    currentFeeding.continue();
    setActiveFeeding(currentFeeding.toObject());
    updateFeedingEntry(currentFeeding);
  };

  const pauseFeeding = () => {
    if (!activeFeeding) {
      return;
    }
    const currentFeeding = new FeedingEntry(activeFeeding);
    currentFeeding.pause();
    setActiveFeeding(currentFeeding.toObject());
    updateFeedingEntry(currentFeeding);
  };

  return (
    <FeedingContext.Provider
      value={{
        feedingEntries,
        startFeeding,
        stopFeeding,
        activeFeeding,
        pauseFeeding,
        continueFeeding,
        switchBoob,
        boobSwitchModal: {
          boobSwitchModalOpened,
          openBoobSwitchModal,
          closeBoobSwitchModal,
        },
      }}
    >
      {children}
    </FeedingContext.Provider>
  );
};

export const useFeedingContext = () => {
  const context = useContext(FeedingContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FeedingProvider');
  }
  return context;
};
