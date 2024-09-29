import { Card, Container, Flex, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';
import BoobButton from 'components/boob-button';
import KpiCard from 'components/kpi-card';
import React from 'react';
import scrollStyles from './scroll-area.module.css';
import { useFeedingContext } from 'service/feeding.service';
import FeedTimer from 'components/feed-timer';
import HistoryCard from 'components/history-card';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import { IFeedingEntry } from 'shared/types/types';
import HistoryInfiniteScrollList from 'components/history-infinite-scroll-list';

export default function FeedTracker(props) {
  const { feedingEntries } = useFeedingContext();

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <Group grow gap="lg">
          <BoobButton label="Left" orientation="Left" />
          <BoobButton label="Right" orientation="Right" />
        </Group>

        <FeedTimer />

        {/* <Stack w="100%" gap="xs">
          <Title order={5}>At a glance</Title>
          <ScrollArea w={'calc(100% + 10px)'} classNames={scrollStyles}>
            <Group wrap="nowrap" py="xxs" px="5px">
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
            </Group>
          </ScrollArea>
        </Stack> */}

        <Stack flex="1 0 0" w="100%" gap="xs">
          <Title order={5}>Feeding History</Title>
          {feedingEntries?.length ? (
            <HistoryInfiniteScrollList data={feedingEntries} ItemComponent={<></>} />
          ) : (
            <Stack gap="xxs" align="center" mt="xl">
              <Text size="sm" c={'dimmed'}>
                There is no history yet.
              </Text>
              <Text size="sm" c={'dimmed'}>
                Start tracking now!
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
