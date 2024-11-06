import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { IPoopEntry } from 'shared/types/types';

/**
 * Create a table if it does not exist.
 * @returns {Promise<void>}
 */
async function createTable(db: SQLiteDBConnection): Promise<boolean> {
  const query = `
      CREATE TABLE IF NOT EXISTS poop (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created INTEGER NOT NULL
      );
    `;
  try {
    await db.execute(query);
    console.log('[PoopDatabase] Table created or already exists');
  } catch (err) {
    console.error('[PoopDatabase] Error creating table:', err);
    return false;
  }
  return true;
}
/**
 * Initializes the poop database by creating the necessary table if it does not exist.
 *
 * @param db - Optional SQLiteDBConnection instance used for executing database commands.
 * @returns A promise that resolves when the table creation is completed.
 */
async function initPoopDB(db?: SQLiteDBConnection): Promise<void> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found');
    return;
  }
  await createTable(db);
}

/**
 * Retrieves all poop entries from the database, ordered by creation date in descending order.
 *
 * @param db - Optional SQLiteDBConnection instance for database access.
 * @returns A promise that resolves to an array of poop entries (`IPoopEntry[]`) or an empty array if an error occurs.
 */
async function getPoopsFromDB(db?: SQLiteDBConnection): Promise<IPoopEntry[] | []> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on get poops');
    return [];
  }
  try {
    const selectResult = await db.query(`SELECT * FROM poop ORDER BY created DESC`);
    return (selectResult?.values as IPoopEntry[]) || [];
  } catch (err) {
    console.error('[PoopDatabase] Error getting poops:', err);
  }
  return [];
}

/**
 * Adds a new poop entry to the database.
 *
 * @param db - SQLiteDBConnection instance required for database interaction.
 * @param entry - The poop entry (`IPoopEntry`) to be added to the database.
 * @returns A promise that resolves to the last inserted row ID (`number`) or `null` if the insertion fails.
 */
async function addPoopEntryToDB(db: SQLiteDBConnection, entry: IPoopEntry): Promise<number | null> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on add poop');
    return null;
  }
  try {
    const result = await db.run(
      `INSERT INTO poop (created)
      VALUES ("${entry.created}");`
    );
    return result.changes?.lastId || null;
  } catch (err) {
    console.error('[PoopDatabase] Error adding poop:', err);
  }
  return null;
}

/**
 * Updates an existing poop entry in the database.
 *
 * @param db - SQLiteDBConnection instance required for database access.
 * @param entry - The poop entry (`IPoopEntry`) containing updated information. Must include the entry ID.
 * @returns A promise that resolves when the update is complete.
 */
async function updatePoopEntryInDB(db: SQLiteDBConnection, entry: IPoopEntry): Promise<void> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on update poop');
    return;
  }
  if (!entry.id) {
    console.error('[PoopDatabase] No id passed');
    return;
  }
  try {
    await db.run(
      `UPDATE poop 
       SET created = "${entry.created}"
       WHERE id = ${entry.id};`
    );
  } catch (err) {
    console.error('[PoopDatabase] Error updating poop:', err);
  }
}

/**
 * Deletes a poop entry from the database by its ID.
 *
 * @param db - SQLiteDBConnection instance required for database interaction.
 * @param id - The ID of the poop entry to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
async function deletePoopEntryFromDB(db: SQLiteDBConnection, id?: number): Promise<void> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on delete poop');
    return;
  }
  if (!id) {
    console.error('[PoopDatabase] No id passed');
    return;
  }
  try {
    await db.run(`DELETE FROM poop WHERE id = ${id};`);
  } catch (err) {
    console.error('[PoopDatabase] Error deleting poop:', err);
  }
}

/**
 * Clears all entries from the poop table and resets the auto-increment sequence.
 *
 * @param db - SQLiteDBConnection instance used to execute the deletion commands.
 * @returns A promise that resolves when the table is cleared and sequence reset.
 */
async function deletePoopsFromDB(db: SQLiteDBConnection): Promise<void> {
  try {
    await db.query(`DELETE FROM poop;`);
    await db.query(`DELETE FROM sqlite_sequence WHERE name = 'poop';`);
  } catch (err) {
    console.error('[PoopDatabase] Error clearing table:', err);
  }
}

export {
  addPoopEntryToDB,
  deletePoopEntryFromDB,
  deletePoopsFromDB,
  getPoopsFromDB,
  initPoopDB,
  updatePoopEntryInDB,
};
