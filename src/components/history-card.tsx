import { Badge, Card, Group, Stack, Text, Transition } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useEffect, useMemo, useState } from 'react';
import formatTime from 'shared/helpers/format-time';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IFeedingEntry } from 'shared/types/types';
import styles from './history-card.module.css';
import Timer from './timer';

interface IHistoryCardProps {
  entry: IFeedingEntry;
  index: number;
}

export default function HistoryCard(props: IHistoryCardProps) {
  const { entry } = props;

  const { isRunning, isPaused, timeAgo, timeFrom, timeTo } = useMemo(() => {
    const feedingEntry = new FeedingEntry(entry);
    return {
      isRunning: feedingEntry.isRunning(),
      isPaused: feedingEntry.isPaused(),
      timeAgo: feedingEntry.getTimeAgo(),
      timeFrom: formatTimeFromTimestamp(feedingEntry.getStarted()),
      timeTo: formatTimeFromTimestamp(feedingEntry.getStopped()),
    };
  }, [entry]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const showTimeAgo = useMemo(() => !isRunning && !isPaused, [isPaused, isRunning]);
  const showTimeAgoPlaceholder = useMemo(() => props.index > 2, [props.index]);

  return (
    <Transition mounted={mounted} transition="fade" duration={400} timingFunction="ease">
      {(transitionStyles) => (
        <Card style={transitionStyles} key={entry.id} shadow="xs">
          {isRunning && <div className={styles.activeCardIndicator} />}
          <Group justify="space-between">
            <Group gap="lg">
              <Badge variant="outline" size="lg" className={monoStyles.monoFont}>
                {entry.boob === 'Left' ? 'L' : 'R'}
              </Badge>

              <Stack gap={'xxs'} align="start">
                <Group gap={'xs'} justify="end" grow>
                  <Text size="12px" c="dimmed">
                    from
                  </Text>
                  <Text size="12px" className={monoStyles.monoFont}>
                    {timeFrom}
                  </Text>
                </Group>
                <Group gap={'xs'} justify="end" w="100%" grow>
                  <Text size="12px" c="dimmed">
                    to
                  </Text>
                  <Text size="12px" className={monoStyles.monoFont}>
                    {timeTo}
                  </Text>
                </Group>
              </Stack>
            </Group>

            <Stack gap="0" align="end">
              <Timer
                isRunning={!!(isRunning && !isPaused)}
                isStopped={false}
                startingSeconds={Math.floor(new FeedingEntry(entry).getDuration() / 1000)}
              >
                {(timer) => (
                  <Text className={`${monoStyles.monoFont} ${isPaused && monoStyles.blinking}`}>
                    {formatTime(timer.seconds)}
                  </Text>
                )}
              </Timer>
              <Text size="12px" c="dimmed">
                duration
              </Text>
            </Stack>
            {showTimeAgo && (
              <Stack
                gap="0"
                align="end"
                className={showTimeAgoPlaceholder ? styles.timeAgoPlaceholder : ''}
              >
                {!showTimeAgoPlaceholder && (
                  <Timer isRunning isStopped={false} startingSeconds={Math.floor(timeAgo / 1000)}>
                    {(timer) => (
                      <Text className={monoStyles.monoFont}>
                        {formatTime(timer.seconds, false)}
                      </Text>
                    )}
                  </Timer>
                )}
                <Text size="12px" c="dimmed">
                  min ago
                </Text>
              </Stack>
            )}
          </Group>
        </Card>
      )}
    </Transition>
  );
}

// duration
// start
// end
// since