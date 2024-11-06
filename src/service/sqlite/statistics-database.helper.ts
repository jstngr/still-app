import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { IBoobDistribution, IFeedingEntry } from 'shared/types/types';

/**
 * Counts the number of feeding chunks within the last 24 hours, grouping feeding entries
 * that are less than 30 minutes apart.
 *
 * @param db - The SQLiteDBConnection instance used to execute the query.
 * @returns An object containing:
 * - `count`: The number of feeding entry chunks created in the last 24 hours.
 * - `entries`: The list of feeding entries retrieved from the database within the last 24 hours.
 * - `chunks`: An array of feeding entry groups (chunks), where each chunk represents
 *    entries that are spaced less than 30 minutes apart.
 */
async function countEntriesChunksInLast24Hours(
  db: SQLiteDBConnection
): Promise<{ count: number; entries: IFeedingEntry[]; chunks: IFeedingEntry[][] }> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found to count entries.');
    return { count: 0, entries: [], chunks: [] };
  }

  try {
    const twentyFiveHoursAgo = Date.now() - 25 * 60 * 60 * 1000;
    const result = await db.query(`
      SELECT *
      FROM feeding
      WHERE created >= ${twentyFiveHoursAgo}
      ORDER BY created ASC
    `);
    const entries = result.values || [];
    if (!entries) return { count: 0, entries: [], chunks: [] };

    /**
     * Groups feeding entries into chunks where the difference between
     * the 'stopped' time of the previous entry and the 'created' time
     * of the current entry is 30 minutes or less.
     */
    const chunks: IFeedingEntry[][] = [];
    let lastChunkIndex = 0;

    entries.forEach((entry, index) => {
      if (index === 0) {
        chunks[lastChunkIndex] = [entry];
        return;
      }

      const diff = entry.created - entries[index - 1].stopped;

      if (diff > 30 * 60 * 1000) {
        lastChunkIndex += 1;
        chunks[lastChunkIndex] = [];
      }
      chunks[lastChunkIndex].push(entry);
    });

    return { count: chunks.length, entries, chunks };
  } catch (err) {
    console.error('[FeedingDatabase] Error counting entries:', err);
    return { count: 0, entries: [], chunks: [] };
  }
}
/**
 * Retrieves the distribution of feeding entries where the "boob" column
 * is either 'Left' or 'Right' within the last 24 hours.
 *
 * @param db - An optional instance of `SQLiteDBConnection` to execute the query.
 * @returns A promise that resolves to an object with the count of 'Left' and 'Right' entries
 *          for the last 24 hours.
 *          - `Left`: The count of entries where `boob` is 'Left'.
 *          - `Right`: The count of entries where `boob` is 'Right'.
 *
 * @remarks
 * - If the `db` parameter is not provided, the function logs an error and returns a default object.
 * - In case of a database query error, it logs the error and returns default counts of zero.
 */
async function getBoobDistributionFromDB(db?: SQLiteDBConnection): Promise<IBoobDistribution> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on get boob distribution');
    return { Left: 0, Right: 0 };
  }

  const twentyFiveHoursAgo = Date.now() - 25 * 60 * 60 * 1000;

  try {
    const selectResult = await db.query(`
      SELECT 
        SUM(CASE WHEN boob = 'Left' THEN 1 ELSE 0 END) AS Left,
        SUM(CASE WHEN boob = 'Right' THEN 1 ELSE 0 END) AS Right
      FROM feeding
      WHERE created >= ${twentyFiveHoursAgo};
    `);

    const result = selectResult?.values?.[0] as IBoobDistribution;
    return { Left: result.Left || 0, Right: result.Right || 0 };
  } catch (err) {
    console.error('[FeedingDatabase] Error getting boob distribution:', err);
  }

  return { Left: 0, Right: 0 };
}

export { countEntriesChunksInLast24Hours, getBoobDistributionFromDB };
