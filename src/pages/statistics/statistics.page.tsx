import { Card, Container, Stack } from '@mantine/core';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import { countEntriesChunksInLast24Hours } from 'service/sqlite/statistics-database.helper';
import { IFeedingEntry } from 'shared/types/types';
import BoobCompareKpiCard from './components/boob-compare-kpi-card';
import FeedingLastTwentyFourKpiCard from './components/feeding-last-twenty-four-kpi-card';
import TimelineChart from './components/timeline-chart';

export default function StatisticsPage() {
  const { feedingEntries, addFeedingEntry } = useFeedingContext();
  const { t } = useTranslation();

  const { db, sqlReady } = useSQLiteContext();

  const [chunksAmount, setChunksAmount] = useState(0);
  const [entries, setentries] = useState<IFeedingEntry[]>([]);
  const [chunks, setChunks] = useState<IFeedingEntry[][]>([]);

  useEffect(() => {
    async function loadChunks() {
      if (db) {
        const result = await countEntriesChunksInLast24Hours(db);
        setChunksAmount(result.count);
        setentries(result.entries);
        setChunks(result.chunks);
      }
    }
    if (sqlReady) {
      loadChunks();
    }
  }, [sqlReady]);

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" h="100%" w="100%">
        <FeedingLastTwentyFourKpiCard value={chunksAmount} />

        <Card w="100%" shadow="xs">
          <TimelineChart chunks={chunks} />
        </Card>

        <BoobCompareKpiCard left={10} right={8} />
      </Stack>
    </Container>
  );
}
