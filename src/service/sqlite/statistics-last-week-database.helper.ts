import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import FeedingEntry from 'classes/feeding-entry.class';
import formatMillisecondsToTime from 'shared/helpers/format-milliseconds-to-time';
import { IFeedingEntry, IPoopEntry } from 'shared/types/types';
import { getAverageTimeBetween, splitEntriesIntoChunks } from './statistics-database.helper';

function getWeekAgoTimestamp() {
  const now = new Date();
  now.setDate(now.getDate() - 6);
  now.setHours(0, 0, 0, 0); // Start from 0:00 of 6 days ago
  const startTime = now.getTime();
  return startTime;
}

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
    console.error('[FeedingDatabase] No db instance found on get type distribution');
    return {};
  }

  const weekAgo = getWeekAgoTimestamp();

  try {
    const feedingResult = await db.query(`
      SELECT 
        *
      FROM feeding
      WHERE created >= ${weekAgo}
      ORDER BY created ASC;
    `);

    const groupedByDay: Record<string, IFeedingEntry[]> = {};
    if (!feedingResult.values) return {};

    feedingResult.values.forEach((row: IFeedingEntry) => {
      const date = new Date(row.created).toISOString().split('T')[0];
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      groupedByDay[date].push(row);
    });

    const dataGroupedByDay: IFeedingDataGroupedByDay = {};

    const getTotalTime = (entries: IFeedingEntry[]) => {
      let time = 0;
      entries.forEach((entry) => {
        const eObject = new FeedingEntry(entry);
        time += eObject.getDuration();
      });
      return time;
    };

    Object.keys(groupedByDay).forEach((day) => {
      const entries = groupedByDay[day];
      const left = entries.filter(({ type }) => type === 'Left');
      const right = entries.filter(({ type }) => type === 'Right');
      const bottle = entries.filter(({ type }) => type === 'Bottle');
      const leftAmount = left.length;
      const leftTime = formatMillisecondsToTime(getTotalTime(left), false, true);
      const rightAmount = right.length;
      const rightTime = formatMillisecondsToTime(getTotalTime(right), false, true);
      const bottleAmount = bottle.length || 0;
      const bottleTotalVolume = bottle.reduce((acc, cur) => acc + (cur.volume || 0), 0);
      const bottleAverageVolume = bottleTotalVolume / (bottleAmount || 1);
      const feedingChunkAmount = splitEntriesIntoChunks(
        entries.filter(({ type }) => type !== 'Bottle'),
      )?.length;

      dataGroupedByDay[day] = {
        entries,
        leftAmount,
        leftTime,
        rightAmount,
        rightTime,
        bottleAmount,
        bottleTotalVolume,
        bottleAverageVolume,
        feedingChunkAmount,
      };
    });

    return dataGroupedByDay;
  } catch (err) {
    console.error('[FeedingDatabase] Error getting boob distribution:', err);
  }

  return {};
}

export interface IPoopDataGroupedByDayData {
  poopEntries: IPoopEntry[];
  averageTimeBetweenPoops: string;
}
export type IPoopDataGroupedByDay = Record<string, IPoopDataGroupedByDayData>;

async function getPoops2weeksFromDB(db?: SQLiteDBConnection): Promise<IPoopDataGroupedByDay> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on get type distribution');
    return {};
  }

  const weekAgo = getWeekAgoTimestamp();

  try {
    const poopResult = await db.query(`
      SELECT 
        *
      FROM poop
      WHERE created >= ${weekAgo}
      ORDER BY created ASC;
    `);

    const groupedByDay: Record<string, IPoopEntry[]> = {};
    if (!poopResult.values) return {};

    poopResult.values.forEach((row: IPoopEntry) => {
      const date = new Date(row.created).toISOString().split('T')[0];
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      groupedByDay[date].push(row);
    });

    const dataGroupedByDay: IPoopDataGroupedByDay = {};

    Object.keys(groupedByDay).forEach((day) => {
      const poopEntries = groupedByDay[day];
      const averageTimeBetweenPoops = formatMillisecondsToTime(
        getAverageTimeBetween(poopEntries || []),
        false,
        true,
      );

      dataGroupedByDay[day] = {
        poopEntries,
        averageTimeBetweenPoops,
      };
    });

    return dataGroupedByDay;
  } catch (err) {
    console.error('[PoopDatabase] Error getting poop for the last week:', err);
  }

  return {};
}

export { getFeedings2weeksFromDB, getPoops2weeksFromDB };
