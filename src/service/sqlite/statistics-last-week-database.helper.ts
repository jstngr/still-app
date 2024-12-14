import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import FeedingEntry from 'classes/feeding-entry.class';
import formatMillisecondsToTime from 'shared/helpers/format-milliseconds-to-time';
import { IFeedingEntry, IPoopEntry, ISleepEntry } from 'shared/types/types';
import { getAverageTimeBetween, splitEntriesIntoChunks } from './statistics-database.helper';
import { getAverageTotalDurationOfEntries } from 'shared/helpers/get-average-total-duration-of-entries';

/**
 * Utility function to calculate the timestamp of a week ago.
 * @returns {number} Timestamp of a week ago
 */
function getWeekAgoTimestamp(): number {
  const now = new Date();
  now.setDate(now.getDate() - 6);
  now.setHours(0, 0, 0, 0); // Start from 0:00 of 6 days ago
  return now.getTime();
}

/**
 * Utility function to group database rows by day.
 * @param entries List of database entries
 * @param key Key to group by (e.g., `created`)
 */
function groupByDay<T extends { created: number }>(entries: T[]): Record<string, T[]> {
  return entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.created).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/** Feeding Data Types */
export interface IFeedingDataGroupedByDayData {
  leftAmount: number;
  leftTime: string;
  rightAmount: number;
  rightTime: string;
  feedingChunkAmount: number;
  bottleAmount: number;
  bottleTotalVolume: number;
  bottleAverageVolume: number;
  entries: IFeedingEntry[];
}

export type IFeedingDataGroupedByDay = Record<string, IFeedingDataGroupedByDayData>;

async function getFeedings2weeksFromDB(db?: SQLiteDBConnection): Promise<IFeedingDataGroupedByDay> {
  if (!db) {
    console.error('[FeedingDatabase] No database instance found.');
    return {};
  }

  const weekAgo = getWeekAgoTimestamp();

  try {
    const query = `
      SELECT * 
      FROM feeding
      WHERE created >= ?
      ORDER BY created ASC;
    `;
    const feedingResult = await db.query(query, [weekAgo]);

    if (!feedingResult.values) return {};

    const groupedByDay = groupByDay<IFeedingEntry>(feedingResult.values);

    const dataGroupedByDay: IFeedingDataGroupedByDay = {};

    Object.keys(groupedByDay).forEach((day) => {
      const entries = groupedByDay[day];
      const left = entries.filter(({ type }) => type === 'Left');
      const right = entries.filter(({ type }) => type === 'Right');
      const bottle = entries.filter(({ type }) => type === 'Bottle');

      dataGroupedByDay[day] = {
        entries,
        leftAmount: left.length,
        leftTime: formatMillisecondsToTime(
          left.reduce((sum, entry) => sum + new FeedingEntry(entry).getDuration(), 0),
          false,
          true,
        ),
        rightAmount: right.length,
        rightTime: formatMillisecondsToTime(
          right.reduce((sum, entry) => sum + new FeedingEntry(entry).getDuration(), 0),
          false,
          true,
        ),
        bottleAmount: bottle.length,
        bottleTotalVolume: bottle.reduce((sum, { volume = 0 }) => sum + volume, 0),
        bottleAverageVolume:
          bottle.reduce((sum, { volume = 0 }) => sum + volume, 0) / (bottle.length || 1),
        feedingChunkAmount:
          splitEntriesIntoChunks(entries.filter(({ type }) => type !== 'Bottle'))?.length || 0,
      };
    });

    return dataGroupedByDay;
  } catch (err) {
    console.error('[FeedingDatabase] Error fetching feeding data:', err);
    return {};
  }
}

/** Poop Data Types */
export interface IPoopDataGroupedByDayData {
  poopEntries: IPoopEntry[];
  averageTimeBetweenPoops: string;
}

export type IPoopDataGroupedByDay = Record<string, IPoopDataGroupedByDayData>;

async function getPoops2weeksFromDB(db?: SQLiteDBConnection): Promise<IPoopDataGroupedByDay> {
  if (!db) {
    console.error('[PoopDatabase] No database instance found.');
    return {};
  }

  const weekAgo = getWeekAgoTimestamp();

  try {
    const query = `
      SELECT * 
      FROM poop
      WHERE created >= ?
      ORDER BY created ASC;
    `;
    const poopResult = await db.query(query, [weekAgo]);

    if (!poopResult.values) return {};

    const groupedByDay = groupByDay<IPoopEntry>(poopResult.values);

    const dataGroupedByDay: IPoopDataGroupedByDay = {};

    Object.keys(groupedByDay).forEach((day) => {
      const poopEntries = groupedByDay[day];
      dataGroupedByDay[day] = {
        poopEntries,
        averageTimeBetweenPoops: formatMillisecondsToTime(
          getAverageTimeBetween(poopEntries),
          false,
          true,
        ),
      };
    });

    return dataGroupedByDay;
  } catch (err) {
    console.error('[PoopDatabase] Error fetching poop data:', err);
    return {};
  }
}

/** Sleep Data Types */
export interface ISleepDataGroupedByDayData {
  sleepEntries: ISleepEntry[];
  averageDurationOfSleeps: string;
  totalDurationOfSleeps: string;
}

export type ISleepDataGroupedByDay = Record<string, ISleepDataGroupedByDayData>;

async function getSleeps2weeksFromDB(db?: SQLiteDBConnection): Promise<ISleepDataGroupedByDay> {
  if (!db) {
    console.error('[SleepDatabase] No database instance found.');
    return {};
  }

  const weekAgo = getWeekAgoTimestamp();

  try {
    const query = `
      SELECT * 
      FROM sleep
      WHERE created >= ?
      ORDER BY created ASC;
    `;
    const sleepResult = await db.query(query, [weekAgo]);

    if (!sleepResult.values) return {};

    const groupedByDay = groupByDay<ISleepEntry>(sleepResult.values);

    const dataGroupedByDay: ISleepDataGroupedByDay = {};

    Object.keys(groupedByDay).forEach((day) => {
      const sleepEntries = groupedByDay[day];
      const { average, total } = getAverageTotalDurationOfEntries(sleepEntries);
      dataGroupedByDay[day] = {
        sleepEntries,
        averageDurationOfSleeps: formatMillisecondsToTime(average, false, true),
        totalDurationOfSleeps: formatMillisecondsToTime(total, false, true),
      };
    });

    return dataGroupedByDay;
  } catch (err) {
    console.error('[SleepDatabase] Error fetching sleep data:', err);
    return {};
  }
}

export { getFeedings2weeksFromDB, getPoops2weeksFromDB, getSleeps2weeksFromDB };
