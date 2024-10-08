import { useDebouncedCallback } from '@mantine/hooks';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TLanguage } from 'translations/react-i18next';

interface ISettingsContextType {
  language: string;
  babyName: string;
  setLanguage: (language: TLanguage) => void;
  onChangeBabyName: (name: string) => void;
}

const SettingsContext = createContext<ISettingsContextType | undefined>(undefined);

interface ISettingsProviderProps {
  children: ReactNode;
  databaseReady: boolean;
}

export const SettingsProvider: React.FC<ISettingsProviderProps> = ({ children, databaseReady }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<TLanguage>('en');
  const [babyName, setBabyName] = useState('Nina');

  useEffect(() => {
    async function loadData() {}

    loadData();
  }, [databaseReady]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const saveNameToDatabase = useDebouncedCallback(async (name: string) => {}, 500);

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
