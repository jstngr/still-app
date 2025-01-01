import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import sqliteService from './sqlite-service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

interface ISQLiteProviderProps {
  children: ReactNode;
}

interface ISQLiteContextType {
  db?: SQLiteDBConnection;
  sqlReady: boolean;
}

const SQLiteContext = createContext<ISQLiteContextType | undefined>(undefined);

interface ISQLiteProviderProps {
  children: ReactNode;
}

export const SQLiteProvider: React.FC<ISQLiteProviderProps> = ({ children }) => {
  const dbName = 'tiny-feeds-database';
  const readonly = false;
  const [db, setDb] = useState<SQLiteDBConnection>();
  const [sqlReady, setSqlReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        // Get or create a database connection using the singleton service
        const db = await sqliteService.getConnection(dbName, readonly);
        setDb(db);

        setSqlReady(true);
      } catch (err) {
        console.error('Failed to initialize the database:', err);
      }
    };

    initDb();

    // Cleanup on unmount: close the connection
    return () => {
      sqliteService.closeConnection(dbName);
    };
  }, [dbName, readonly]);

  // Detect hot module reloading and close the connection to avoid issues
  if (module.hot) {
    module.hot.dispose(() => {
      sqliteService.closeConnection(dbName);
      console.log('Hot reload detected. SQLite connection closed.');
    });
  }

  return (
    <SQLiteContext.Provider
      value={{
        db,
        sqlReady,
      }}
    >
      {children}
    </SQLiteContext.Provider>
  );
};

export const useSQLiteContext = () => {
  const context = useContext(SQLiteContext);
  if (context === undefined) {
    throw new Error('useSQLiteContext must be used within a SQLiteProvider');
  }
  return context;
};
