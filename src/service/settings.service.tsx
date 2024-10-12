import { useDebouncedCallback } from '@mantine/hooks';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TLanguage } from 'translations/react-i18next';
import { useSQLiteContext } from './sqlite/sqlite-provider';
import {
  getSettingsFromDB,
  initSettingsDB,
  saveBabyNameToDB,
} from './sqlite/settings-database.helpers';

interface ISettingsContextType {
  language: TLanguage;
  babyName: string;
  setLanguage: (language: TLanguage) => void;
  onChangeBabyName: (name: string) => void;
}

export interface ISettingsObject {
  id: number;
  language: TLanguage;
  babyName: string;
}

const SettingsContext = createContext<ISettingsContextType | undefined>(undefined);

interface ISettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<ISettingsProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<TLanguage>('en');
  const [babyName, setBabyName] = useState('Nina');

  const { db, sqlReady } = useSQLiteContext();

  useEffect(() => {
    async function loadData() {
      await initSettingsDB(db);

      const data = await getSettingsFromDB(db);
      if (data) {
        setLanguage(data.language);
        setBabyName(data.babyName);
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
    console.log('🚀 ~ saveNameToDatabase ~ db:', db);
  }, 500);

  const onChangeBabyName = (name: string) => {
    saveNameToDatabase(name);
    setBabyName(name);
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        babyName,
        setLanguage,
        onChangeBabyName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingProvider');
  }
  return context;
};
