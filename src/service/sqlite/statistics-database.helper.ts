import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import { IFeedingEntry } from 'shared/types/types';

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
    const twentyFourHoursAgo = Date.now() - 25 * 60 * 60 * 1000;
    const result = await db.query(`
      SELECT *
      FROM feeding
      WHERE created >= ${twentyFourHoursAgo}
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

export { countEntriesChunksInLast24Hours };
