import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import {
  countEntriesChunksInLast24Hours,
  getBoobDistributionFromDB,
  getBottleFeedingsFromDB,
  getPoopFromDB,
} from 'service/sqlite/statistics-database.helper';
import formatMillisecondsToMinutes from 'shared/helpers/format-milliseconds-to-minutes';
import formatMillisecondsToTime from 'shared/helpers/format-milliseconds-to-time';
import { IBoobDistribution, IFeedingEntry, IPoopEntry } from 'shared/types/types';

export default function useLast24Hours() {
  const { db, sqlReady } = useSQLiteContext();

  const [chunks, setChunks] = useState<IFeedingEntry[][]>([]);
  const [averageChunkDuration, setAverageChunkDuration] = useState('00');

  const [boobDistribution, setBoobDistribution] = useState<IBoobDistribution>();
  const [averageDurationLeft, setAverageDurationLeft] = useState('00');
  const [averageDurationRight, setAverageDurationRight] = useState('00');

  const [bottleFeedings, setBottleFeedings] = useState<IFeedingEntry[]>([]);
  const [averageBottleVolume, setAverageBottleVolume] = useState(0);

  const [poopEntries, setPoopEntries] = useState<IPoopEntry[]>([]);
  const [averagePoopDistance, setAveragePoopDistance] = useState('0');

  const getAverageChunkDuration = (cChunks: IFeedingEntry[][]) => {
    let average = 0;
    cChunks.forEach((chunk) => {
      const start = chunk[0].created;
      const end = chunk[chunk.length - 1].stopped || start;
      const duration = end - start;
      average += duration;
    });
    if (average === 0) return '0';
    return formatMillisecondsToMinutes(Math.floor(average / cChunks.length));
  };

  const getAverageDuration = (entries: IFeedingEntry[]) => {
    let average = 0;
    entries.forEach((entry) => {
      const start = entry.created;
      const end = entry.stopped || start;
      const duration = end - start;
      average += duration;
    });
    if (average === 0) return '0';
    return formatMillisecondsToMinutes(Math.floor(average / entries.length));
  };

  const getAverageVolume = (entries: IFeedingEntry[]) => {
    let average = 0;
    entries.forEach(({ volume }) => {
      average += volume || 0;
    });
    if (average === 0) return 0;
    return Math.floor(average / entries.length);
  };

  const loadData = async () => {
    if (!db) return;
    const chunksResult = await countEntriesChunksInLast24Hours(db);
    setChunks(chunksResult.chunks);
    setAverageChunkDuration(getAverageChunkDuration(chunksResult.chunks));

    const distributionResult = await getBoobDistributionFromDB(db);
    setBoobDistribution(distributionResult);
    setAverageDurationLeft(getAverageDuration(distributionResult.LeftFeedings || []));
    setAverageDurationRight(getAverageDuration(distributionResult.RightFeedings || []));

    const { bottleFeedings } = await getBottleFeedingsFromDB(db);
    setBottleFeedings(bottleFeedings);
    setAverageBottleVolume(getAverageVolume(bottleFeedings));

    const { poopEntries: pEntry, averageDistance } = await getPoopFromDB(db);
    setPoopEntries(pEntry);
    setAveragePoopDistance(formatMillisecondsToTime(averageDistance, false, true));
  };
  useEffect(() => {
    if (!sqlReady) return;
    loadData();
  }, [sqlReady]);

  return {
    chunks,
    averageChunkDuration,
    boobDistribution,
    averageDurationLeft,
    averageDurationRight,
    averageBottleVolume,
    bottleAmount: bottleFeedings.length,
    poopEntries,
    averagePoopDistance,
  };
}
