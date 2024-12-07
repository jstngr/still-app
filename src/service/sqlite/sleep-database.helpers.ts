import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ISleepEntry } from 'shared/types/types';

/**
 * Create a table if it does not exist.
 * @returns {Promise<void>}
 */
async function createTable(db: SQLiteDBConnection): Promise<boolean> {
  const query = `
      CREATE TABLE IF NOT EXISTS sleep (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created INTEGER NOT NULL,
        stopped INTEGER
      );
    `;
  try {
    await db.execute(query);
    console.log('[SleepDatabase] Table created or already exists');
  } catch (err) {
    console.error('[SleepDatabase] Error creating table:', err);
    return false;
  }
  return true;
}

/**
 * Initializes the 'sleep' table in the database.
 *
 * @param db - An optional SQLiteDBConnection instance. If no connection is passed, an error will be logged.
 *
 * @returns A promise that resolves when the database is initialized and a row is added if necessary.
 */
async function initSleepDB(db?: SQLiteDBConnection): Promise<void> {
  if (!db) {
    console.error('[SleepDatabase] No db instance found');
    return;
  }
  await createTable(db);
}

/**
 * Retrieves all sleep entries from the database, ordered by the creation date.
 *
 * @param db - The SQLiteDBConnection instance.
 * @returns A promise that resolves to an array of sleep entries or an empty array if no entries are found.
 *
 * @throws Will log an error if the database instance is not found or if there's an error while querying the database.
 */
async function getSleepsFromDB(db?: SQLiteDBConnection): Promise<ISleepEntry[] | []> {
  if (!db) {
    console.error('[SleepDatabase] No db instance found on get sleep');
    return [];
  }
  try {
    const selectResult = await db.query(`SELECT * FROM sleep ORDER BY created DESC`);
    return (selectResult?.values as ISleepEntry[]) || [];
  } catch (err) {
    console.error('[SleepDatabase] Error getting sleep:', err);
  }
  return [];
}

/**
 * Adds a new sleep entry to the database.
 *
 * @param db - The SQLiteDBConnection instance.
 * @param entry - The sleep entry object to be added to the database.
 * @returns A promise that resolves to the ID of the newly inserted entry or null if the insertion fails.
 *
 * @throws Will log an error if the database instance is not found or if there's an error during the insertion.
 */
async function addSleepEntryToDB(
  db: SQLiteDBConnection,
  entry: ISleepEntry,
): Promise<number | null> {
  if (!db) {
    console.error('[SleepDatabase] No db instance found on add sleep');
    return null;
  }
  try {
    const result = await db.run(
      `INSERT INTO sleep (created, stopped)
      VALUES ("${entry.created}", "${entry.stopped}");`,
    );
    return result.changes?.lastId || null;
  } catch (err) {
    console.error('[SleepDatabase] Error adding sleep:', err);
  }
  return null;
}

/**
 * Updates an existing sleep entry in the database.
 *
 * @param db - The SQLiteDBConnection instance.
 * @param entry - The sleep entry object containing updated values.
 *
 * @throws Will log an error if the database instance is not found, if the entry has no id, or if there's an error during the update.
 */
async function updateSleepEntryInDB(db: SQLiteDBConnection, entry: ISleepEntry): Promise<void> {
  if (!db) {
    console.error('[SleepDatabase] No db instance found on update sleep');
    return;
  }
  if (!entry.id) {
    console.error('[SleepDatabase] No id passed');
    return;
  }
  try {
    await db.run(
      `UPDATE sleep 
       SET created = "${entry.created}", 
          stopped = "${entry.stopped}"
       WHERE id = ${entry.id};`,
    );
  } catch (err) {
    console.error('[SleepDatabase] Error updating sleep:', err);
  }
}

/**
 * Deletes a sleep entry from the database.
 *
 * @param db - The SQLiteDBConnection instance.
 * @param entry - The sleep entry object to be deleted (must contain an id).
 *
 * @throws Will log an error if the database instance is not found, if the entry has no id, or if there's an error during the deletion.
 */
async function deleteSleepEntryFromDB(db: SQLiteDBConnection, id?: number): Promise<void> {
  if (!db) {
    console.error('[SleepDatabase] No db instance found on delete sleep');
    return;
  }
  if (!id) {
    console.error('[SleepDatabase] No id passed');
    return;
  }
  try {
    await db.run(`DELETE FROM sleep WHERE id = ${id};`);
  } catch (err) {
    console.error('[SleepDatabase] Error deleting sleep:', err);
  }
}

async function deleteSleepsFromDB(db: SQLiteDBConnection): Promise<void> {
  try {
    await db.query(`DELETE FROM sleep;`);
    await db.query(`DELETE FROM sqlite_sequence WHERE name = 'sleep';`);
  } catch (err) {
    console.error('[SleepDatabase] Error clearing table:', err);
  }
}

export {
  deleteSleepsFromDB,
  addSleepEntryToDB,
  deleteSleepEntryFromDB,
  getSleepsFromDB,
  initSleepDB,
  updateSleepEntryInDB,
};
