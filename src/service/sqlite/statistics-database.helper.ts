import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { IBoobDistribution, IFeedingEntry, IPoopEntry, ISleepEntry } from 'shared/types/types';

/**
 * Groups feeding entries into chunks where the difference between
 * the 'stopped' time of the previous entry and the 'created' time
 * of the current entry is 30 minutes or less.
 */
export function splitEntriesIntoChunks(entries: IFeedingEntry[]) {
  if (!entries) return [];
  const chunks: IFeedingEntry[][] = [];
  let lastChunkIndex = 0;

  entries.forEach((entry, index) => {
    if (index === 0) {
      chunks[lastChunkIndex] = [entry];
      return;
    }

    const diff = entry.created - (entries[index - 1].stopped || entry.created);

    if (diff > 30 * 60 * 1000) {
      lastChunkIndex += 1;
      chunks[lastChunkIndex] = [];
    }
    chunks[lastChunkIndex].push(entry);
  });
  return chunks;
}

/**
 * Counts the number of feeding chunks within the last 24 hours, grouping feeding entries
 * that are less than 30 minutes apart.
 *
 * @param db - The SQLiteDBConnection instance used to execute the query.
 * @returns An object containing:
 * - `count`: The number of feeding entry chunks created in the last 24 hours.
 * - `chunks`: An array of feeding entry groups (chunks), where each chunk represents
 *    entries that are spaced less than 30 minutes apart.
 */
async function countEntriesChunksInLast24Hours(
  db: SQLiteDBConnection,
): Promise<{ count: number; chunks: IFeedingEntry[][] }> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found to count entries.');
    return { count: 0, chunks: [] };
  }

  try {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const result = await db.query(`
      SELECT *
      FROM feeding
      WHERE created >= ${twentyFourHoursAgo}
        AND type != 'Bottle'
      ORDER BY created ASC
    `);
    const entries = result.values || [];
    if (!entries) return { count: 0, chunks: [] };

    const chunks = splitEntriesIntoChunks(entries);

    return { count: chunks.length, chunks };
  } catch (err) {
    console.error('[FeedingDatabase] Error counting entries:', err);
    return { count: 0, chunks: [] };
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
    console.error('[FeedingDatabase] No db instance found on get type distribution');
    return { Left: 0, Right: 0, LeftFeedings: [], RightFeedings: [] };
  }

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  try {
    const distributionResult = await db.query(`
      SELECT 
        SUM(CASE WHEN type = 'Left' THEN 1 ELSE 0 END) AS Left,
        SUM(CASE WHEN type = 'Right' THEN 1 ELSE 0 END) AS Right
      FROM feeding
      WHERE created >= ${twentyFourHoursAgo}
      ORDER BY created ASC;
    `);

    const distribution = distributionResult?.values?.[0] as IBoobDistribution;
    const leftFeedingsResult = await db.query(`
      SELECT * FROM feeding
      WHERE created >= ${twentyFourHoursAgo}
      AND type = 'Left'
      ORDER BY created ASC;
    `);
    const rightFeedingsResult = await db.query(`
      SELECT * FROM feeding
      WHERE created >= ${twentyFourHoursAgo}
      AND type = 'Right';
      ORDER BY created ASC
    `);
    return {
      Left: distribution.Left || 0,
      Right: distribution.Right || 0,
      LeftFeedings: leftFeedingsResult?.values as IFeedingEntry[],
      RightFeedings: rightFeedingsResult?.values as IFeedingEntry[],
    };
  } catch (err) {
    console.error('[FeedingDatabase] Error getting boob distribution:', err);
  }

  return { Left: 0, Right: 0, LeftFeedings: [], RightFeedings: [] };
}

async function getBottleFeedingsFromDB(
  db?: SQLiteDBConnection,
): Promise<{ bottleFeedings: IFeedingEntry[] }> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on get type distribution');
    return { bottleFeedings: [] };
  }

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  try {
    const feedingResult = await db.query(`
      SELECT *
      FROM feeding
      WHERE created >= ${twentyFourHoursAgo}
      AND type = 'Bottle'
      ORDER BY created ASC;
    `);

    return {
      bottleFeedings: feedingResult.values as IFeedingEntry[],
    };
  } catch (err) {
    console.error('[FeedingDatabase] Error getting boob distribution:', err);
  }

  return { bottleFeedings: [] };
}

async function getPoopFromDB(
  db?: SQLiteDBConnection,
): Promise<{ poopEntries: IPoopEntry[]; averageDistance: number }> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on get type distribution');
    return { poopEntries: [], averageDistance: 0 };
  }

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  try {
    const poopResult = await db.query(`
      SELECT *
      FROM poop
      WHERE created >= ${twentyFourHoursAgo}
      ORDER BY created ASC;
    `);

    let averageDistance = 0;
    let lastCreated = 0;
    (poopResult.values as IPoopEntry[])?.forEach((poop) => {
      if (!lastCreated) {
        lastCreated = poop.created;
        return;
      }
      averageDistance += poop.created - lastCreated;
      lastCreated = poop.created;
    });
    averageDistance = Math.floor(averageDistance / (poopResult.values?.length || 1));

    return {
      poopEntries: poopResult.values as IPoopEntry[],
      averageDistance,
    };
  } catch (err) {
    console.error('[FeedingDatabase] Error getting boob distribution:', err);
  }

  return { poopEntries: [], averageDistance: 0 };
}

async function getSleepStatsFromDB(
  db?: SQLiteDBConnection,
): Promise<{ sleepEntries: ISleepEntry[]; averageLength: number; totalLength: number }> {
  if (!db) {
    console.error('[SleepDatabase] No db instance found on get sleep stats');
    return { sleepEntries: [], averageLength: 0, totalLength: 0 };
  }

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  try {
    const sleepResult = await db.query(`
      SELECT *
      FROM sleep
      WHERE created >= ${twentyFourHoursAgo}
      ORDER BY created ASC;
    `);

    let averageLength = 0;
    let totalLength = 0;
    (sleepResult.values as ISleepEntry[])?.forEach((sleep) => {
      const start = sleep.created;
      const end = sleep.stopped || start;
      averageLength += end - start;
      totalLength += end - start;
    });
    averageLength = Math.floor(averageLength / (sleepResult.values?.length || 1));

    return {
      sleepEntries: sleepResult.values as ISleepEntry[],
      averageLength,
      totalLength,
    };
  } catch (err) {
    console.error('[SleepDatabase] Error getting sleep stats:', err);
  }

  return { sleepEntries: [], averageLength: 0, totalLength: 0 };
}

export {
  getPoopFromDB,
  countEntriesChunksInLast24Hours,
  getBoobDistributionFromDB,
  getBottleFeedingsFromDB,
  getSleepStatsFromDB,
};
