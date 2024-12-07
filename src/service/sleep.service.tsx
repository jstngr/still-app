import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { ISleepEntry } from 'shared/types/types';
import { useSQLiteContext } from './sqlite/sqlite-provider';
import SleepEntry from 'classes/sleep-entry.class';
import {
  addSleepEntryToDB,
  deleteSleepEntryFromDB,
  deleteSleepsFromDB,
  getSleepsFromDB,
  initSleepDB,
  updateSleepEntryInDB,
} from './sqlite/sleep-database.helpers';

interface ISleepContextType {
  activeSleep?: ISleepEntry;
  sleepEntries: ISleepEntry[];
  startSleep: () => void;
  stopSleep: () => void;
  deleteSleepEntry: (id: number) => void;
  updateSleepEntry: (entry: SleepEntry) => void;
  addSleepEntry: () => void;
  deleteHistory: () => Promise<void>;
  editSleepEntryDrawer: {
    sleepEntryDrawerOpened: boolean;
    openSleepEntryDrawer: (id: number) => void;
    closeSleepEntryDrawer: () => void;
    sleepEntryDrawerEntryId?: number;
  };
}

const SleepContext = createContext<ISleepContextType | undefined>(undefined);

interface ISleepProviderProps {
  children: ReactNode;
}

export const SleepProvider: React.FC<ISleepProviderProps> = ({ children }) => {
  const [sleepEntries, setSleepEntries] = useState<ISleepEntry[]>([]);
  const [activeSleep, setActiveSleep] = useState<ISleepEntry>();

  const [sleepEntryDrawerEntryId, setSleepEntryDrawerEntryId] = useState<number>();
  const sleepEntryDrawerOpened = !!sleepEntryDrawerEntryId;
  const openSleepEntryDrawer = (id: number) => setSleepEntryDrawerEntryId(id);
  const closeSleepEntryDrawer = () => setSleepEntryDrawerEntryId(undefined);

  const { db, sqlReady } = useSQLiteContext();

  async function loadData() {
    await initSleepDB(db);
    const data = await getSleepsFromDB(db);
    setSleepEntries(data);
    if (!data[0]?.stopped) {
      setActiveSleep(data[0]);
    }
    // inserMok(db);
  }
  useEffect(() => {
    loadData();
  }, [sqlReady]);

  const updateSleepEntry = async (updateWith: SleepEntry) => {
    setSleepEntries((current) =>
      current.map((entry) => {
        if (entry.id === updateWith.getId()) {
          return updateWith.toObject();
        }
        return entry;
      }),
    );
    if (db) {
      await updateSleepEntryInDB(db, updateWith.toObject());
    }
    // get again from DB to have sorted list
    loadData();
  };

  const deleteSleepEntry = async (idToDelete?: number) => {
    if (idToDelete) {
      setSleepEntries((current) => current.filter(({ id }) => id !== idToDelete));
      if (db) {
        await deleteSleepEntryFromDB(db, idToDelete);
      }
    }
  };

  const stopSleep = async () => {
    if (!activeSleep) {
      return;
    }
    const curentSleep = new SleepEntry(activeSleep);
    curentSleep.stop();
    if (curentSleep.getDuration() < 2000) {
      await deleteSleepEntry(curentSleep.getId());
    } else {
      updateSleepEntry(curentSleep);
    }
    setActiveSleep(undefined);
  };

  const startSleep = async () => {
    const newSleep = new SleepEntry({});
    if (db) {
      const id = await addSleepEntryToDB(db, newSleep.toObject());
      if (id) {
        newSleep.setId(id);
      }
    }
    setActiveSleep(newSleep.toObject());
    setSleepEntries((current) => [newSleep.toObject(), ...current]);
  };

  const addSleepEntry = async () => {
    const newEntry = new SleepEntry({ stopped: new Date().getTime() });
    if (db) {
      const id = await addSleepEntryToDB(db, newEntry.toObject());
      if (id) {
        newEntry.setId(id);
      }
    }
    setSleepEntries((current) => [newEntry.toObject(), ...current]);
    setSleepEntryDrawerEntryId(newEntry.getId());
  };

  const deleteHistory = async () => {
    if (db) {
      await deleteSleepsFromDB(db);
    }
    setSleepEntries([]);
    setActiveSleep(undefined);
  };

  return (
    <SleepContext.Provider
      value={{
        deleteHistory,
        sleepEntries,
        startSleep,
        stopSleep,
        activeSleep,
        deleteSleepEntry,
        updateSleepEntry,
        addSleepEntry,
        editSleepEntryDrawer: {
          sleepEntryDrawerOpened,
          openSleepEntryDrawer,
          closeSleepEntryDrawer,
          sleepEntryDrawerEntryId,
        },
      }}
    >
      {children}
    </SleepContext.Provider>
  );
};

export const useSleepContext = () => {
  const context = useContext(SleepContext);
  if (context === undefined) {
    throw new Error('useSleepContext must be used within a SleepProvider');
  }
  return context;
};
