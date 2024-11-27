import { Card, Container, Stack, Title } from '@mantine/core';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import {
  countEntriesChunksInLast24Hours,
  getBoobDistributionFromDB,
} from 'service/sqlite/statistics-database.helper';
import { IBoobDistribution, IFeedingEntry } from 'shared/types/types';
import BoobCompareKpiCard from './components/boob-compare-kpi-card';
import FeedingLastTwentyFourKpiCard from './components/feeding-last-twenty-four-kpi-card';
import TimelineChart from './components/timeline-chart';
import { useSettingsContext } from 'service/settings.service';

export default function StatisticsPage() {
  const { feedingEntries, addFeedingEntry } = useFeedingContext();
  const { feedByBoob, feedByBottle, poopTrackerEnabled, sleepTrackerEnabled } =
    useSettingsContext();
  const { t } = useTranslation();

  const { db, sqlReady } = useSQLiteContext();

  const [chunksAmount, setChunksAmount] = useState(0);
  const [entries, setentries] = useState<IFeedingEntry[]>([]);
  const [chunks, setChunks] = useState<IFeedingEntry[][]>([]);
  const [boobDistribution, setBoobDistribution] = useState<IBoobDistribution>({
    Left: 0,
    Right: 0,
  });

  useEffect(() => {
    async function loadChunks() {
      if (db) {
        const result = await countEntriesChunksInLast24Hours(db);
        setChunksAmount(result.count);
        setentries(result.entries);
        setChunks(result.chunks);

        const boobDistributionResult = await getBoobDistributionFromDB(db);
        setBoobDistribution(boobDistributionResult);
      }
    }
    if (sqlReady) {
      loadChunks();
    }
  }, [sqlReady]);

  return (
    <Container fluid h="100%" w="100%">
      <Stack gap="lg">
        <Stack align="left" h="100%" w="100%">
          <Title order={5}>Feeding Statistics</Title>
          <FeedingLastTwentyFourKpiCard value={chunksAmount} />

          <Card w="100%" withBorder>
            <TimelineChart chunks={chunks} />
          </Card>

          <BoobCompareKpiCard left={boobDistribution.Left} right={boobDistribution.Right} />
        </Stack>
        {poopTrackerEnabled && (
          <Stack align="left" h="100%" w="100%">
            <Title order={5}>Poop Statistics</Title>
          </Stack>
        )}
        {sleepTrackerEnabled && (
          <Stack align="left" h="100%" w="100%">
            <Title order={5}>Sleep Statistics</Title>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
