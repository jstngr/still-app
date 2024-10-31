import { Card, Container, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { Bar } from 'react-chartjs-2';
import KpiCard from 'components/kpi-card';
import { countEntriesChunksInLast24Hours } from 'service/sqlite/statistics-database.helper';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import { IFeedingEntry } from 'shared/types/types';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import TimelineChart from './components/timeline-chart';

ChartJS.register(CategoryScale, TimeScale, BarElement, Title, Tooltip, Legend);

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

  if (!entries?.length) return <></>;

  const twentyFourHoursAgo = Date.now() - 25 * 60 * 60 * 1000 + 80000000;
  const twentyforAgoDate = new Date(twentyFourHoursAgo);

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <KpiCard amount={chunksAmount} text="Since last 24h" title="Feedings" />
        <Card w="100%" shadow="xs">
          <TimelineChart chunks={chunks} />
        </Card>
      </Stack>
    </Container>
  );
}
