import { useDebouncedCallback } from '@mantine/hooks';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TLanguage } from 'translations/react-i18next';
import {
  deleteSettingsFromDB,
  getSettingsFromDB,
  initSettingsDB,
  saveAppRatedToDb,
  saveBabyNameToDB,
  saveDefaultVolumeToDB,
  saveFeedByBoobToDB,
  saveFeedByBottleToDB,
  saveFeedingUnitToDB,
  saveInitializedToDb,
  saveLanguageToDB,
  savePoopTrackerEnabledToDB,
  saveSleepTrackerEnabledToDB,
} from './sqlite/settings-database.helpers';
import { useSQLiteContext } from './sqlite/sqlite-provider';

interface ISettingsContextType {
  language: TLanguage;
  babyName: string;
  feedByBoob: boolean;
  feedByBottle: boolean;
  onChangeLanguage: (language: TLanguage) => void;
  onChangeBabyName: (name: string) => void;
  onChangeFeedingUnit: (unit: string) => void;
  deleteSettings: () => Promise<void>;
  poopTrackerEnabled: boolean;
  sleepTrackerEnabled: boolean;
  initialized: boolean;
  feedingUnit: string;
  defaultVolume: number;
  onChangePoopTrackerEnabled: (value: boolean) => Promise<void>;
  onChangeSleepTrackerEnabled: (value: boolean) => Promise<void>;
  onChangeFeedByBoob: (value: boolean) => Promise<void>;
  onChangeFeedByBottle: (value: boolean) => Promise<void>;
  onChangeDefaultVolume: (value: number) => void;
  onInitialized: () => Promise<void>;
  settingsLoaded: boolean;
  appRated: boolean;
  onAppRated: () => Promise<void>;
}

export interface ISettingsObject {
  id: number;
  language: TLanguage;
  babyName: string;
  sleepTracker: boolean;
  poopTracker: boolean;
  initialized: boolean;
  feedByBoob: boolean;
  feedingUnit: string;
  defaultVolume: number;
  feedByBottle: boolean;
  appRated: boolean;
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
  const [feedByBoob, setFeedByBoob] = useState(true);
  const [feedByBottle, setFeedByBottle] = useState(false);
  const [feedingUnit, setFeedingUnit] = useState('ml');
  const [defaultVolume, setDefaultVolume] = useState(100);
  const [appRated, setAppRated] = useState(false);

  const { db, sqlReady } = useSQLiteContext();

  async function loadData() {
    await initSettingsDB(db);

    const data = await getSettingsFromDB(db);

    if (data) {
      setLanguage(data.language);
      setBabyName(data.babyName);
      setSleepTrackerEnabled(data.sleepTracker);
      setPoopTrackerEnabled(data.poopTracker);
      setInitialized(data.initialized);
      setFeedByBoob(data.feedByBoob);
      setFeedByBottle(data.feedByBottle);
      setFeedingUnit(data.feedingUnit);
      setDefaultVolume(data.defaultVolume);
      setAppRated(data.appRated);
      setSettingsLoaded(true);
    }
  }

  useEffect(() => {
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

  const saveFeedingUnitToDatabase = useDebouncedCallback(async (unit: string) => {
    if (db) {
      await saveFeedingUnitToDB(db, unit);
    }
  }, 500);

  const saveDefaultVolumeToDatabase = useDebouncedCallback(async (volume: number) => {
    if (db) {
      await saveDefaultVolumeToDB(db, volume);
    }
  }, 500);

  const onChangeBabyName = (name: string) => {
    saveNameToDatabase(name);
    setBabyName(name);
  };

  const onChangeFeedingUnit = (unit: string) => {
    saveFeedingUnitToDatabase(unit);
    setFeedingUnit(unit);
  };

  const onChangeDefaultVolume = (volume: number) => {
    saveDefaultVolumeToDatabase(volume);
    setDefaultVolume(volume);
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
      await loadData();
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

  const onChangeFeedByBoob = async (value: boolean) => {
    if (db) {
      const result = await saveFeedByBoobToDB(db, value);
      if (result !== null) {
        setFeedByBoob(result);
      }
    }
  };

  const onChangeFeedByBottle = async (value: boolean) => {
    if (db) {
      const result = await saveFeedByBottleToDB(db, value);
      if (result !== null) {
        setFeedByBottle(result);
      }
    }
  };

  const onInitialized = async () => {
    if (db) {
      await saveInitializedToDb(db);
      setInitialized(true);
    }
  };

  const onAppRated = async () => {
    if (db) {
      await saveAppRatedToDb(db);
      setAppRated(true);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        babyName,
        initialized,
        feedByBoob,
        feedByBottle,
        defaultVolume,
        feedingUnit,
        onChangeFeedByBoob,
        onChangeFeedByBottle,
        onChangeLanguage,
        onChangeBabyName,
        deleteSettings,
        poopTrackerEnabled,
        sleepTrackerEnabled,
        onChangePoopTrackerEnabled,
        onChangeSleepTrackerEnabled,
        settingsLoaded,
        onInitialized,
        onChangeFeedingUnit,
        onChangeDefaultVolume,
        onAppRated,
        appRated,
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
