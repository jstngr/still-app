import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ISettingsObject } from 'service/settings.service';
import { Device } from '@capacitor/device';
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
        language TEXT NOT NULL
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
      await db.run(`INSERT INTO settings (babyName, language) VALUES ("", "${language}");`);
    }
  } catch (err) {
    console.error('[SettingsDatabase] Error setting row: ', err);
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
    return (selectResult?.values?.[0] as ISettingsObject) || null;
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
  name: ISettingsObject['babyName']
): Promise<void> {
  try {
    await db.query(`UPDATE settings SET babyName = "${name}";`);
  } catch (err) {
    console.error('[SettingsDatabase] Error updating baby name:', err);
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
  language: ISettingsObject['babyName'] // Assuming language field uses the same type as babyName in ISettingsObject
): Promise<void> {
  try {
    await db.query(`UPDATE settings SET language = "${language}";`);
  } catch (err) {
    console.error('[SettingsDatabase] Error updating language:', err);
  }
}

export { initSettingsDB, getSettingsFromDB, saveBabyNameToDB, saveLanguageToDB };
