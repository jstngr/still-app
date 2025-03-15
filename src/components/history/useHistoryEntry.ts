import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';

interface HistoryEntryBase {
  id: number;
  started?: number;
  created?: number;
  stopped?: number;
}

interface UseHistoryEntryProps<T extends HistoryEntryBase> {
  entry: T;
  getDuration: () => number;
  isRunning: () => boolean;
}

export function useHistoryEntry<T extends HistoryEntryBase>({
  entry,
  getDuration,
  isRunning,
}: UseHistoryEntryProps<T>) {
  const startTimestamp = entry.started ?? entry.created;
  if (!startTimestamp) {
    console.error('Entry is missing both started and created timestamps:', entry);
    return {
      timeFrom: '--:--',
      timeTo: '--:--',
      durationInSeconds: 0,
      isEntryRunning: false,
    };
  }

  const timeFrom = formatTimeFromTimestamp(startTimestamp);
  const timeTo = entry.stopped ? formatTimeFromTimestamp(entry.stopped) : '--:--';
  const durationInSeconds = Math.floor(getDuration() / 1000);
  const isEntryRunning = isRunning();

  return {
    timeFrom,
    timeTo,
    durationInSeconds,
    isEntryRunning,
  };
}
