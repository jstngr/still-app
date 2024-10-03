import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ISettingsContextType {
  language: string;
  babyName: string;
}

const SettingsContext = createContext<ISettingsContextType | undefined>(undefined);

interface ISettingsProviderProps {
  children: ReactNode;
  databaseReady: boolean;
}

export const SettingsProvider: React.FC<ISettingsProviderProps> = ({ children, databaseReady }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [babyName, setBabyName] = useState('Nina');

  useEffect(() => {}, [databaseReady]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <SettingsContext.Provider
      value={{
        language,
        babyName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a SettingProvider');
  }
  return context;
};
