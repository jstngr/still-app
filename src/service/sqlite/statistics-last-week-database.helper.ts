import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import FeedingEntry from 'classes/feeding-entry.class';
import formatMillisecondsToTime from 'shared/helpers/format-milliseconds-to-time';
import { IFeedingEntry } from 'shared/types/types';
import { splitEntriesIntoChunks } from './statistics-database.helper';

function getWeekAgoTimestamp() {
  const now = new Date();
  now.setDate(now.getDate() - 6);
  now.setHours(0, 0, 0, 0); // Start from 0:00 of 6 days ago
  const startTime = now.getTime();
  return startTime;
}

export interface IDataGroupedByDay {
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

const emptyDataGroupedByDayState: IDataGroupedByDay = {
  entries: [],
  leftAmount: 0,
  leftTime: '00:00',
  rightAmount: 0,
  rightTime: '00:00',
  bottleAmount: 0,
  bottleTotalVolume: 0,
  bottleAverageVolume: 0,
  feedingChunkAmount: 0,
};

async function getFeedings2weeksFromDB(db?: SQLiteDBConnection): Promise<IDataGroupedByDay> {
  if (!db) {
    console.error('[FeedingDatabase] No db instance found on get type distribution');
    return emptyDataGroupedByDayState;
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
    if (!feedingResult.values) return emptyDataGroupedByDayState;

    feedingResult.values.forEach((row: IFeedingEntry) => {
      const date = new Date(row.created).toISOString().split('T')[0];
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      groupedByDay[date].push(row);
    });

    const dataGroupedByDay: IDataGroupedByDay = emptyDataGroupedByDayState;

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

  return emptyDataGroupedByDayState;
}

async function getPoops2weeksFromDB(db?: SQLiteDBConnection): Promise<IDataGroupedByDay> {
  if (!db) {
    console.error('[PoopDatabase] No db instance found on get type distribution');
    return emptyDataGroupedByDayState;
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

    const groupedByDay: Record<string, IFeedingEntry[]> = {};
    if (!feedingResult.values) return emptyDataGroupedByDayState;

    feedingResult.values.forEach((row: IFeedingEntry) => {
      const date = new Date(row.created).toISOString().split('T')[0];
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      groupedByDay[date].push(row);
    });

    const dataGroupedByDay: IDataGroupedByDay = emptyDataGroupedByDayState;

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
    console.error('[PoopDatabase] Error getting poop for the last week:', err);
  }

  return emptyDataGroupedByDayState;
}

export { getFeedings2weeksFromDB, emptyDataGroupedByDayState, getPoops2weeksFromDB };
