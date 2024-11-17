import { useDebouncedCallback } from '@mantine/hooks';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TLanguage } from 'translations/react-i18next';
import {
  deleteSettingsFromDB,
  getSettingsFromDB,
  initSettingsDB,
  saveBabyNameToDB,
  saveInitializedToDb,
  saveLanguageToDB,
  savePoopTrackerEnabledToDB,
  saveSleepTrackerEnabledToDB,
} from './sqlite/settings-database.helpers';
import { useSQLiteContext } from './sqlite/sqlite-provider';

interface ISettingsContextType {
  language: TLanguage;
  babyName: string;
  onChangeLanguage: (language: TLanguage) => void;
  onChangeBabyName: (name: string) => void;
  deleteSettings: () => Promise<void>;
  poopTrackerEnabled: boolean;
  sleepTrackerEnabled: boolean;
  initialized: boolean;
  onChangePoopTrackerEnabled: (value: boolean) => Promise<void>;
  onChangeSleepTrackerEnabled: (value: boolean) => Promise<void>;
  onInitialized: () => Promise<void>;
  settingsLoaded: boolean;
}

export interface ISettingsObject {
  id: number;
  language: TLanguage;
  babyName: string;
  sleepTracker: boolean;
  poopTracker: boolean;
  initialized: boolean;
}

const SettingsContext = createContext<ISettingsContextType | undefined>(undefined);

interface ISettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<ISettingsProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<TLanguage>('en');
  const [babyName, setBabyName] = useState('Nina');
  const [poopTrackerEnabled, setPoopTrackerEnabled] = useState(false);
  const [sleepTrackerEnabled, setSleepTrackerEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const { db, sqlReady } = useSQLiteContext();

  useEffect(() => {
    async function loadData() {
      await initSettingsDB(db);

      const data = await getSettingsFromDB(db);

      if (data) {
        setLanguage(data.language);
        setBabyName(data.babyName);
        setSleepTrackerEnabled(data.sleepTracker);
        setPoopTrackerEnabled(data.poopTracker);
        setInitialized(data.initialized);
        setSettingsLoaded(true);
      }
    }

    loadData();
  }, [sqlReady]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const saveNameToDatabase = useDebouncedCallback(async (name: string) => {
    if (db) {
      await saveBabyNameToDB(db, name);
    }
  }, 500);

  const onChangeBabyName = (name: string) => {
    saveNameToDatabase(name);
    setBabyName(name);
  };

  const onChangeLanguage = async (language: TLanguage) => {
    if (db) {
      await saveLanguageToDB(db, language);
    }
    setLanguage(language);
  };

  const deleteSettings = async () => {
    if (db) {
      await deleteSettingsFromDB(db);
    }
  };

  const onChangePoopTrackerEnabled = async (value: boolean) => {
    if (db) {
      const result = await savePoopTrackerEnabledToDB(db, value);
      if (result !== null) {
        setPoopTrackerEnabled(result);
      }
    }
  };
  const onChangeSleepTrackerEnabled = async (value: boolean) => {
    if (db) {
      const result = await saveSleepTrackerEnabledToDB(db, value);
      if (result !== null) {
        setSleepTrackerEnabled(result);
      }
    }
  };

  const onInitialized = async () => {
    if (db) {
      await saveInitializedToDb(db);
      setInitialized(true);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        babyName,
        initialized,
        onChangeLanguage,
        onChangeBabyName,
        deleteSettings,
        poopTrackerEnabled,
        sleepTrackerEnabled,
        onChangePoopTrackerEnabled,
        onChangeSleepTrackerEnabled,
        settingsLoaded,
        onInitialized,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingProvider');
  }
  return context;
};

export { SettingsContext, useSettingsContext };
