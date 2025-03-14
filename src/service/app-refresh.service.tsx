import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import React from 'react';
import { App as CapacitorApp } from '@capacitor/app';

interface IAppRefreshProps {
  children: ReactNode;
}

interface IAppRefreshContextType {
  toggleState: boolean;
}

const AppRefreshContext = createContext<IAppRefreshContextType | undefined>(undefined);

export const AppRefreshProvider: React.FC<IAppRefreshProps> = ({ children }) => {
  const [toggleState, setToggleState] = useState(false);

  useEffect(() => {
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        setToggleState(true);
        const timeout = setTimeout(() => {
          setToggleState(false);
        }, 1);
        return () => clearTimeout(timeout);
      }
    });
  }, []);

  return (
    <AppRefreshContext.Provider value={{ toggleState }}>{children}</AppRefreshContext.Provider>
  );
};

export const useAppRefreshContext = () => {
  const context = useContext(AppRefreshContext);
  if (context === undefined) {
    throw new Error('useAppRefreshContext must be used within a AppRefreshProvider');
  }
  return context;
};
