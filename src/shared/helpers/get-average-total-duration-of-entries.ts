import { IFeedingEntry, ISleepEntry } from 'shared/types/types';

export function getAverageTotalDurationOfEntries(entries: ISleepEntry[] | IFeedingEntry[]) {
  if (!entries?.length) {
    return {
      average: 0,
      total: 0,
    };
  }
  let duration = 0;
  entries.forEach((entry) => {
    const start = entry.created;
    const end = entry.stopped || start;
    duration += end - start;
  });
  return {
    average: Math.floor(duration / entries.length),
    total: duration,
  };
}
