import React, { useEffect, useState } from 'react';
import sqliteService from 'service/sqlite-service';

export default function SettingsPage() {
  const [settings, setSettings] = useState();

  useEffect(() => {}, []);

  // // Initialize the database on component mount
  // useEffect(() => {
  //   const initDb = async () => {
  //     await sqliteService.initDb();
  //     loadItems();
  //   };
  //   initDb();

  //   // Close the database on component unmount
  //   return () => {
  //     sqliteService.closeDb();
  //   };
  // }, []);

  // const loadItems = async () => {
  //   const loadedItems = await sqliteService.loadItems();
  //   setSettings(loadedItems);
  // };

  // const addItem = async () => {
  //   await sqliteService.insertItem(name, value);
  //   setName('');
  //   setValue('');
  //   loadItems();
  // };

  return <div>settings.page</div>;
}
