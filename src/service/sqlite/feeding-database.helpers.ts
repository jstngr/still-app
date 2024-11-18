import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { IFeedingEntry } from 'shared/types/types';

/**
 * Create a table if it does not exist.
 * @returns {Promise<void>}
 */
async function createTable(db: SQLiteDBConnection): Promise<boolean> {
  const query = `
      CREATE TABLE IF NOT EXISTS feeding (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created INTEGER NOT NULL,
        stopped INTEGER, 
        boob TEXT NOT NULL,
        pauseStart INTEGER,
        pauseDuration INTEGER
      );
    `;
  try {
    await db.execute(query);
    console.log('[FeedingDatabase] Table created or already exists');
  } catch (err) {
    console.error('[FeedingDatabase] Error creating table:', err);
    return false;
  }
  return true;
}

/**
 * Initializes the 'feeding' table in the database.
 *
 * @param db - An optional SQLiteDBConnection instance. If no connection is passed, an error will be logged.
 *
 * @returns A promise that resolves when the database is initialized and a row is added if necessary.
 */
async function initFeedingDB(db?: SQLiteDBConnection): Promise<void> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found');
    return;
  }
  await createTable(db);
}
/**
 * Retrieves all feeding entries from the database, ordered by the creation date.
 *
 * @param db - The SQLiteDBConnection instance.
 * @returns A promise that resolves to an array of feeding entries or an empty array if no entries are found.
 *
 * @throws Will log an error if the database instance is not found or if there's an error while querying the database.
 */
async function getFeedingsFromDB(db?: SQLiteDBConnection): Promise<IFeedingEntry[] | []> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on get feeding');
    return [];
  }
  try {
    const selectResult = await db.query(`SELECT * FROM feeding ORDER BY created DESC`);
    return (selectResult?.values as IFeedingEntry[]) || [];
  } catch (err) {
    console.error('[FeedingDatabase] Error getting feeding:', err);
  }
  return [];
}

/**
 * Adds a new feeding entry to the database.
 *
 * @param db - The SQLiteDBConnection instance.
 * @param entry - The feeding entry object to be added to the database.
 * @returns A promise that resolves to the ID of the newly inserted entry or null if the insertion fails.
 *
 * @throws Will log an error if the database instance is not found or if there's an error during the insertion.
 */
async function addFeedingEntryToDB(
  db: SQLiteDBConnection,
  entry: IFeedingEntry
): Promise<number | null> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on add feeding');
    return null;
  }
  try {
    const result = await db.run(
      `INSERT INTO feeding (created, stopped, boob, pauseStart, pauseDuration)
      VALUES ("${entry.created}", "${entry.stopped}", "${entry.boob}", "${entry.pauseStart}", "${entry.pauseDuration}")`
    );
    return result.changes?.lastId || null;
  } catch (err) {
    console.error('[FeedingDatabase] Error adding feeding:', err);
  }
  return null;
}

/**
 * Updates an existing feeding entry in the database.
 *
 * @param db - The SQLiteDBConnection instance.
 * @param entry - The feeding entry object containing updated values.
 *
 * @throws Will log an error if the database instance is not found, if the entry has no id, or if there's an error during the update.
 */
async function updateFeedingEntryInDB(db: SQLiteDBConnection, entry: IFeedingEntry): Promise<void> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on update feeding');
    return;
  }
  if (!entry.id) {
    console.error('[FeedingDatabase] No id passed');
    return;
  }
  try {
    await db.run(
      `UPDATE feeding 
       SET created = "${entry.created}", 
           stopped = "${entry.stopped}", 
           boob = "${entry.boob}", 
           pauseStart = "${entry.pauseStart}", 
           pauseDuration = "${entry.pauseDuration}" 
       WHERE id = ${entry.id};`
    );
  } catch (err) {
    console.error('[FeedingDatabase] Error updating feeding:', err);
  }
}

/**
 * Deletes a feeding entry from the database.
 *
 * @param db - The SQLiteDBConnection instance.
 * @param entry - The feeding entry object to be deleted (must contain an id).
 *
 * @throws Will log an error if the database instance is not found, if the entry has no id, or if there's an error during the deletion.
 */
async function deleteFeedingEntryFromDB(db: SQLiteDBConnection, id?: number): Promise<void> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on delete feeding');
    return;
  }
  if (!id) {
    console.error('[FeedingDatabase] No id passed');
    return;
  }
  try {
    await db.run(`DELETE FROM feeding WHERE id = ${id};`);
  } catch (err) {
    console.error('[FeedingDatabase] Error deleting feeding:', err);
  }
}

async function deleteFeedingsFromDB(db: SQLiteDBConnection): Promise<void> {
  try {
    await db.query(`DELETE FROM feeding;`);
    await db.query(`DELETE FROM sqlite_sequence WHERE name = 'feeding';`);
  } catch (err) {
    console.error('[FeedingDatabase] Error clearing table:', err);
  }
}

export {
  deleteFeedingsFromDB,
  addFeedingEntryToDB,
  deleteFeedingEntryFromDB,
  getFeedingsFromDB,
  initFeedingDB,
  updateFeedingEntryInDB,
};
