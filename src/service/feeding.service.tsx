import React, { createContext, useState, ReactNode, useContext, useMemo, useEffect } from 'react';
import { IBoob, IFeedingEntry } from 'shared/types/types';
import FeedingEntry from '../classes/feeding-entry.class';
import mockData from './mock-data';

interface FeedingContextType {
  activeFeeding?: IFeedingEntry;
  feedingEntries: IFeedingEntry[];
  startFeeding: (boob: IBoob) => void;
  stopFeeding: () => void;
  pauseFeeding: () => void;
  continueFeeding: () => void;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

interface FeedingProviderProps {
  children: ReactNode;
}

export const FeedingProvider: React.FC<FeedingProviderProps> = ({ children }) => {
  const [feedingEntries, setFeedingEntries] = useState<IFeedingEntry[]>(mockData);
  const [activeFeeding, setActiveFeeding] = useState<IFeedingEntry>();
  const lastId = useMemo(() => feedingEntries[0]?.id || 0, [feedingEntries]);

  const updateFeedingEntry = (updateWith: FeedingEntry) => {
    setFeedingEntries((current) =>
      current.map((entry) => {
        if (entry.id === updateWith.getId()) {
          return updateWith.toObject();
        }
        return entry;
      })
    );
  };

  const stopFeeding = () => {
    if (!activeFeeding) {
      return;
    }
    const currentFeeding = new FeedingEntry(activeFeeding);
    currentFeeding.stop();
    if (currentFeeding.getDuration() < 2000) {
      setFeedingEntries((current) => current.filter(({ id }) => id !== currentFeeding.getId()));
    } else {
      updateFeedingEntry(currentFeeding);
    }
    setActiveFeeding(undefined);
  };

  const startFeeding = (boob: IBoob) => {
    stopFeeding();
    const newFeeding = new FeedingEntry({ id: lastId + 1, boob });
    setActiveFeeding(newFeeding.toObject());
    setFeedingEntries((current) => [newFeeding.toObject(), ...current]);
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
