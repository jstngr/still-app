import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import sqliteService from 'service/sqlite-service';

interface ISQLiteContextType {}

const SQLiteContext = createContext<ISQLiteContextType | undefined>(undefined);

interface ISQLiteProviderProps {
  children: ReactNode;
}

export const SQLiteProvider: React.FC<ISQLiteProviderProps> = ({ children }) => {
  const [databaseLoading, setDatabaseLoading] = useState(true);
  const [sqlite, setSqlite] = useState<SQLiteConnection>();
  const [db, setDb] = useState<SQLiteDBConnection>();

  const dbName = 'still-app-database';
  const readonly = false;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      jeepSqlite(window);
    }

    const initDb = async () => {
      // Initialize and open a connection to the SQLite database.
      try {
        const initialSqlite = new SQLiteConnection(CapacitorSQLite);
        setSqlite(initialSqlite);

        if (!initialSqlite) throw new Error('SQLite plugin is not initialized');

        const isConnected = await initialSqlite.isConnection(dbName, readonly);

        console.log(isConnected);
        const bla = await initialSqlite.retrieveAllConnections();
        console.log('bla', bla);

        let initialDB;
        if (isConnected.result) {
          console.log('CONNECTION FOUND');

          initialDB = await initialSqlite.retrieveConnection(dbName, readonly);
        } else {
          console.log('NO CONNECTION FOUND');

          initialDB = await initialSqlite.createConnection(
            dbName,
            false,
            'no-encryption',
            1,
            readonly
          );
        }

        if (!initialDB) throw new Error('Failed to create the SQLite connection');

        await initialDB.open();

        setDb(initialDB);
        // await this.createTable(); // Create the table

        SplashScreen.hide();
      } catch (err) {
        console.error('Failed to initialize the database:', err);
      }
    };
    initDb();

    // Detect hot module reloading and close the connection to avoid issues
    if (module.hot) {
      module.hot.dispose(() => {
        sqlite?.closeConnection(dbName, readonly);
        console.log('Hot reload detected. SQLite connection closed.');
      });
    }

    // Close connection on dismount
    return () => {
      sqliteService.closeDb();
      db?.close();
    };
  }, []);

  return <SQLiteContext.Provider value={{}}>{children}</SQLiteContext.Provider>;
};

export const useSQLiteContext = () => {
  const context = useContext(SQLiteContext);
  if (context === undefined) {
    throw new Error('useSQLiteContext must be used within a SettingProvider');
  }
  return context;
};
