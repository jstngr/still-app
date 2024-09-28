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
          <ScrollArea
            type="always"
            flex={'1 0 0'}
            w={'calc(100% + 10px)'}
            classNames={scrollStyles}
          >
            <Stack p="2px 20px 4px 0px" gap="xs">
              {feedingEntries.map((entry, index) => {
                const prevEntry = feedingEntries[index - 1];
                let label = <></>;
                if (
                  !prevEntry ||
                  formatDateFromTimestamp(prevEntry.created) !==
                    formatDateFromTimestamp(entry.created)
                ) {
                  label = (
                    <Text c="dimmed" size="12px" mt={index !== 0 ? 'xs' : undefined}>
                      {formatDateLocaleFromTimestamp(entry.created)}
                    </Text>
                  );
                }
                return (
                  <>
                    {label}
                    <HistoryCard entry={entry} index={index} />
                  </>
                );
              })}
              {!feedingEntries?.length && (
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
          </ScrollArea>
        </Stack>
      </Stack>
    </Container>
  );
}
