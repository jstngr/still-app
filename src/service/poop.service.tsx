import PoopEntry from 'classes/poop-entry.class';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { IPoopEntry } from 'shared/types/types';
import {
  addPoopEntryToDB,
  deletePoopEntryFromDB,
  deletePoopsFromDB,
  getPoopsFromDB,
  initPoopDB,
  updatePoopEntryInDB,
} from './sqlite/poop-database.helpers';
import { useSQLiteContext } from './sqlite/sqlite-provider';

interface IPoopContextType {
  poopEntries: IPoopEntry[];
  deletePoop: (id: number) => void;
  updatePoopEntry: (entry: PoopEntry) => void;
  addPoopEntry: () => void;
  deleteHistory: () => Promise<void>;
  editPoopEntryDrawer: {
    poopEntryDrawerOpened: boolean;
    openPoopEntryDrawer: (id: number) => void;
    closePoopEntryDrawer: () => void;
    poopEntryDrawerEntryId?: number;
  };
}

const PoopContext = createContext<IPoopContextType | undefined>(undefined);

interface IPoopProviderProps {
  children: ReactNode;
}

export const PoopProvider: React.FC<IPoopProviderProps> = ({ children }) => {
  const [poopEntries, setPoopEntries] = useState<IPoopEntry[]>([]);
  const [poopEntryDrawerEntryId, setPoopEntryDrawerEntryId] = useState<number>();
  const poopEntryDrawerOpened = !!poopEntryDrawerEntryId;
  const openPoopEntryDrawer = (id: number) => setPoopEntryDrawerEntryId(id);
  const closePoopEntryDrawer = () => setPoopEntryDrawerEntryId(undefined);

  const { db, sqlReady } = useSQLiteContext();

  async function loadData() {
    await initPoopDB(db);
    const data = await getPoopsFromDB(db);
    setPoopEntries(data);
  }
  useEffect(() => {
    loadData();
  }, [sqlReady]);

  const updatePoopEntry = async (updateWith: PoopEntry) => {
    setPoopEntries((current) =>
      current.map((entry) => {
        if (entry.id === updateWith.getId()) {
          return updateWith.toObject();
        }
        return entry;
      })
    );
    if (db) {
      await updatePoopEntryInDB(db, updateWith.toObject());
    }
    // get again from DB to have sorted list
    loadData();
  };

  const deletePoop = async (idToDelete?: number) => {
    if (idToDelete) {
      setPoopEntries((current) => current.filter(({ id }) => id !== idToDelete));
      if (db) {
        await deletePoopEntryFromDB(db, idToDelete);
      }
    }
  };
  const addPoopEntry = async () => {
    const newEntry = new PoopEntry({});
    if (db) {
      const id = await addPoopEntryToDB(db, newEntry.toObject());
      if (id) {
        newEntry.setId(id);
      }
    }
    setPoopEntries((current) => [newEntry.toObject(), ...current]);
  };

  const deleteHistory = async () => {
    if (db) {
      await deletePoopsFromDB(db);
    }
  };

  return (
    <PoopContext.Provider
      value={{
        poopEntries,
        deleteHistory,
        deletePoop,
        updatePoopEntry,
        addPoopEntry,
        editPoopEntryDrawer: {
          poopEntryDrawerOpened,
          openPoopEntryDrawer,
          closePoopEntryDrawer,
          poopEntryDrawerEntryId,
        },
      }}
    >
      {children}
    </PoopContext.Provider>
  );
};

export const usePoopContext = () => {
  const context = useContext(PoopContext);
  if (context === undefined) {
    throw new Error('usePoopContext must be used within a PoopContext');
  }
  return context;
};
