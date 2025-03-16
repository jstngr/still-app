import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ISettingsObject } from 'service/settings.service';
import getSystemLanguage from 'shared/helpers/get-system-language';

/**
 * Create a table if it does not exist.
 * @returns {Promise<void>}
 */
async function createTable(db: SQLiteDBConnection): Promise<boolean> {
  const query = `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        babyName TEXT,
        language TEXT NOT NULL,
        poopTracker BOOLEAN NOT NULL,
        sleepTracker BOOLEAN NOT NULL,
        feedByBoob BOOLEAN NOT NULL,
        feedByBottle BOOLEAN NOT NULL,
        initialized BOOLEAN NOT NULL,
        feedingUnit TEXT NOT NULL,
        defaultVolume INTEGER NOT NULL,
        appRated BOOLEAN NOT NULL,
        notificationsEnabled BOOLEAN NOT NULL DEFAULT false,
        notificationHours INTEGER NOT NULL DEFAULT 2,
        notificationMinutes INTEGER NOT NULL DEFAULT 0
      );
    `;
  try {
    await db.execute(query);
    console.log('[SettingsDatabase] Table created or already exists');
  } catch (err) {
    console.error('[SettingsDatabase] Error creating table:', err);
    return false;
  }
  return true;
}

/**
 * Adds a new row to the 'settings' table if no rows currently exist.
 * If the table is empty, inserts a row with an empty `babyName` and the current system language.
 *
 * @param db - The SQLiteDBConnection instance to execute the SQL queries.
 *
 * @returns A promise that resolves when the operation is complete.
 */
async function addSettingsRowIfNotExist(db: SQLiteDBConnection): Promise<void> {
  try {
    const selectResult = await db.query(`SELECT * FROM settings`);

    if (!selectResult?.values?.length) {
      const language = await getSystemLanguage();
      await db.run(`
      INSERT INTO settings 
        (babyName, language, poopTracker, sleepTracker, initialized, feedByBoob, feedByBottle, defaultVolume, feedingUnit, appRated, notificationsEnabled, notificationHours, notificationMinutes) 
      VALUES 
        ("", "${language}", true, true, false, true, false, 100, "ml", false, false, 2, 0)
      ;`);
    }
  } catch (err) {
    console.error('[SettingsDatabase] Error setting row: ', err);
  }
}

/**
 * Checks for and adds notification columns to the settings table if they don't exist.
 * Does nothing if the table doesn't exist or if the columns are already present.
 *
 * @param db - The SQLiteDBConnection instance
 * @returns Promise<void>
 */
async function addNotificationColumns(db: SQLiteDBConnection): Promise<void> {
  try {
    // Check if table exists
    const tableCheck = await db.query(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='settings';
    `);

    if (!tableCheck?.values?.length) {
      return;
    }

    const columnInfo = await db.query(`PRAGMA table_info(settings);`);
    const columns = columnInfo.values as Array<{ name: string }>;

    const hasNotificationColumns = columns.some(
      (col) =>
        col.name === 'notificationsEnabled' ||
        col.name === 'notificationHours' ||
        col.name === 'notificationMinutes',
    );

    if (!hasNotificationColumns) {
      try {
        await db.execute(
          'ALTER TABLE settings ADD COLUMN notificationsEnabled BOOLEAN NOT NULL DEFAULT false;',
        );
        await db.execute(
          'ALTER TABLE settings ADD COLUMN notificationHours INTEGER NOT NULL DEFAULT 0;',
        );
        await db.execute(
          'ALTER TABLE settings ADD COLUMN notificationMinutes INTEGER NOT NULL DEFAULT 0;',
        );
      } catch (err) {
        console.error('[SettingsDatabase] Error adding notification columns:', err);
      }
    }
  } catch (err) {
    console.error('[SettingsDatabase] Error checking notification columns:', err);
  }
}

/**
 * Initializes the 'settings' table in the database.
 * If the table is successfully created, it will also ensure a row exists in the table by calling `addSettingsRowIfNotExist`.
 *
 * @param db - An optional SQLiteDBConnection instance. If no connection is passed, an error will be logged.
 *
 * @returns A promise that resolves when the database is initialized and a row is added if necessary.
 */
async function initSettingsDB(db?: SQLiteDBConnection): Promise<void> {
  if (!db) {
    console.error('[SettingsDatabase] No db instance found');
    return;
  }

  await addNotificationColumns(db);
  const result = await createTable(db);
  if (result) {
    await addSettingsRowIfNotExist(db);
  }
}

/**
 * Fetches the settings from the 'settings' table.
 * If the table contains settings, it returns the first row as an ISettingsObject.
 * If no settings are found or the database connection is not provided, it returns null.
 *
 * @param db - An optional SQLiteDBConnection instance. If no connection is passed, an error will be logged.
 *
 * @returns A promise that resolves to an ISettingsObject containing the settings, or null if none are found.
 */
async function getSettingsFromDB(db?: SQLiteDBConnection): Promise<ISettingsObject | null> {
  if (!db) {
    console.error('[SettingsDatabase] No db instance found on get settings');
    return null;
  }
  try {
    const selectResult = await db.query(`SELECT * FROM settings`);
    const data = selectResult?.values?.[0];
    if (data) {
      data.sleepTracker = !!data.sleepTracker;
      data.poopTracker = !!data.poopTracker;
      data.initialized = !!data.initialized;
      data.feedByBoob = !!data.feedByBoob;
      data.feedByBottle = !!data.feedByBottle;
      data.appRated = !!data.appRated;
      data.notificationsEnabled = !!data.notificationsEnabled;
    }
    return (data as ISettingsObject) || null;
  } catch (err) {
    console.error('[SettingsDatabase] Error getting settings:', err);
  }
  return null;
}

/**
 * Updates the 'babyName' field in the 'settings' table with the provided name.
 *
 * @param db - The SQLiteDBConnection instance to execute the SQL query.
 * @param name - The new baby name to be saved to the settings table.
 *
 * @returns A promise that resolves when the baby name is successfully saved.
 */
async function saveBabyNameToDB(
  db: SQLiteDBConnection,
  name: ISettingsObject['babyName'],
): Promise<void> {
  try {
    await db.query(`UPDATE settings SET babyName = "${name}";`);
  } catch (err) {
    console.error('[SettingsDatabase] Error updating baby name:', err);
  }
}

/**
 * Updates the 'feedingUnit' field in the 'settings' table with the provided unit.
 *
 * @param db - The SQLiteDBConnection instance to execute the SQL query.
 * @param unit - The new unit to be saved to the settings table.
 *
 * @returns A promise that resolves when the unit is successfully saved.
 */
async function saveFeedingUnitToDB(
  db: SQLiteDBConnection,
  unit: ISettingsObject['feedingUnit'],
): Promise<void> {
  try {
    await db.query(`UPDATE settings SET feedingUnit = "${unit}";`);
  } catch (err) {
    console.error('[SettingsDatabase] Error updating feeding unit:', err);
  }
}

/**
 * Updates the 'defaultVolume' field in the 'settings' table with the provided volume.
 *
 * @param db - The SQLiteDBConnection instance to execute the SQL query.
 * @param volume - The new volume to be saved to the settings table.
 *
 * @returns A promise that resolves when the volume is successfully saved.
 */
async function saveDefaultVolumeToDB(
  db: SQLiteDBConnection,
  volume: ISettingsObject['defaultVolume'],
): Promise<void> {
  try {
    await db.query(`UPDATE settings SET defaultVolume = "${volume}";`);
  } catch (err) {
    console.error('[SettingsDatabase] Error updating default volume:', err);
  }
}

/**
 * Updates the 'language' field in the 'settings' table with the provided language value.
 *
 * @param db - The SQLiteDBConnection instance to execute the SQL query.
 * @param language - The new language to be saved to the settings table.
 *
 * @returns A promise that resolves when the language is successfully saved.
 *
 * @throws Will log an error to the console if the database query fails.
 */
async function saveLanguageToDB(
  db: SQLiteDBConnection,
  language: ISettingsObject['babyName'], // Assuming language field uses the same type as babyName in ISettingsObject
): Promise<void> {
  try {
    await db.query(`UPDATE settings SET language = "${language}";`);
  } catch (err) {
    console.error('[SettingsDatabase] Error updating language:', err);
  }
}

/**
 * Updates the "poopTracker" setting in the database.
 *
 * @param db - The SQLiteDBConnection instance used to execute the update query.
 * @param poopTracker - The new value for the poop tracker setting.
 * @returns A promise that resolves when the update is complete.
 * @throws Logs an error message if the query fails.
 */
async function savePoopTrackerEnabledToDB(
  db: SQLiteDBConnection,
  poopTracker: ISettingsObject['poopTracker'],
): Promise<boolean | null> {
  try {
    await db.query(`UPDATE settings SET poopTracker = ${poopTracker};`);
    return poopTracker;
  } catch (err) {
    console.error('[SettingsDatabase] Error updating poopTracker:', err);
  }
  return null;
}

/**
 * Updates the "sleepTracker" setting in the database.
 *
 * @param db - The SQLiteDBConnection instance used to execute the update query.
 * @param sleepTracker - The new value for the sleep tracker setting.
 * @returns A promise that resolves when the update is complete.
 * @throws Logs an error message if the query fails.
 */
async function saveSleepTrackerEnabledToDB(
  db: SQLiteDBConnection,
  sleepTracker: ISettingsObject['sleepTracker'],
): Promise<boolean | null> {
  try {
    await db.query(`UPDATE settings SET sleepTracker = ${sleepTracker};`);
    return sleepTracker;
  } catch (err) {
    console.error('[SettingsDatabase] Error updating sleepTracker:', err);
  }
  return null;
}

/**
 * Updates the "feedByBoob" setting in the database.
 *
 * @param db - The SQLiteDBConnection instance used to execute the update query.
 * @param feedByBoob - The new value for the sleep tracker setting.
 * @returns A promise that resolves when the update is complete.
 * @throws Logs an error message if the query fails.
 */
async function saveFeedByBoobToDB(
  db: SQLiteDBConnection,
  feedByBoob: ISettingsObject['feedByBoob'],
): Promise<boolean | null> {
  try {
    await db.query(`UPDATE settings SET feedByBoob = ${feedByBoob};`);
    return feedByBoob;
  } catch (err) {
    console.error('[SettingsDatabase] Error updating feedByBoob:', err);
  }
  return null;
}

/**
 * Updates the "feedByBottle" setting in the database.
 *
 * @param db - The SQLiteDBConnection instance used to execute the update query.
 * @param feedByBottle - The new value for the sleep tracker setting.
 * @returns A promise that resolves when the update is complete.
 * @throws Logs an error message if the query fails.
 */
async function saveFeedByBottleToDB(
  db: SQLiteDBConnection,
  feedByBottle: ISettingsObject['feedByBottle'],
): Promise<boolean | null> {
  try {
    await db.query(`UPDATE settings SET feedByBottle = ${feedByBottle};`);
    return feedByBottle;
  } catch (err) {
    console.error('[SettingsDatabase] Error updating feedByBottle:', err);
  }
  return null;
}

/**
 * Updates the "initialized" boolean in the database.
 *
 * @param db - The SQLiteDBConnection instance used to execute the update query.
 * @returns A promise that resolves when the update is complete to boolean.
 * @throws Logs an error message if the query fails.
 */
async function saveInitializedToDb(db: SQLiteDBConnection): Promise<boolean | null> {
  try {
    await db.query(`UPDATE settings SET initialized = true;`);
    return true;
  } catch (err) {
    console.error('[SettingsDatabase] Error updating initialized:', err);
  }
  return false;
}

/**
 * Updates the "appRated" boolean in the database.
 *
 * @param db - The SQLiteDBConnection instance used to execute the update query.
 * @returns A promise that resolves when the update is complete to boolean.
 * @throws Logs an error message if the query fails.
 */
async function saveAppRatedToDb(db: SQLiteDBConnection): Promise<boolean | null> {
  try {
    await db.query(`UPDATE settings SET appRated = true;`);
    return true;
  } catch (err) {
    console.error('[SettingsDatabase] Error updating appRated:', err);
  }
  return false;
}

async function deleteSettingsFromDB(db: SQLiteDBConnection): Promise<boolean> {
  try {
    await db.query(`DELETE FROM settings;`);
    await db.query(`DELETE FROM sqlite_sequence WHERE name = 'settings';`);
    return true;
  } catch (err) {
    console.error('[SettingsDatabase] Error clearing table:', err);
    return false;
  }
}

// Add new functions to handle notification settings
async function saveNotificationsEnabledToDB(
  db: SQLiteDBConnection,
  enabled: boolean,
): Promise<boolean | null> {
  try {
    await db.run(`UPDATE settings SET notificationsEnabled = ?`, [enabled ? 1 : 0]);
    return enabled;
  } catch (err) {
    console.error('[SettingsDatabase] Error saving notifications enabled:', err);
    return null;
  }
}

async function saveNotificationTimeToDB(
  db: SQLiteDBConnection,
  { hours, minutes }: { hours: number; minutes: number },
): Promise<{ hours: number; minutes: number } | null> {
  try {
    await db.run(`UPDATE settings SET notificationHours = ?, notificationMinutes = ?`, [
      hours,
      minutes,
    ]);
    return { hours, minutes };
  } catch (err) {
    console.error('[SettingsDatabase] Error saving notification time:', err);
    return null;
  }
}

export {
  deleteSettingsFromDB,
  initSettingsDB,
  getSettingsFromDB,
  saveBabyNameToDB,
  saveLanguageToDB,
  savePoopTrackerEnabledToDB,
  saveSleepTrackerEnabledToDB,
  saveInitializedToDb,
  saveFeedByBoobToDB,
  saveFeedByBottleToDB,
  saveFeedingUnitToDB,
  saveDefaultVolumeToDB,
  saveAppRatedToDb,
  saveNotificationsEnabledToDB,
  saveNotificationTimeToDB,
};
