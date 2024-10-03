import { Badge, Card, Grid, Group, Stack, Text } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import formatTime from 'shared/helpers/format-time';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IFeedingEntry } from 'shared/types/types';
import Timer from '../timer';
import styles from './history-card.module.css';

interface IHistoryCardProps {
  entry: IFeedingEntry;
  index: number;
}

export default function HistoryCard(props: IHistoryCardProps) {
  const { entry, index } = props;
  const { t } = useTranslation();

  const { feedingEntries } = useFeedingContext();

  const showDateLabel = useMemo(() => {
    const prevEntry = feedingEntries[index - 1];
    return (
      !prevEntry ||
      formatDateFromTimestamp(prevEntry.created) !== formatDateFromTimestamp(entry.created)
    );
  }, [feedingEntries]);

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

  const showTimeAgo = useMemo(() => !isRunning && !isPaused, [isPaused, isRunning]);
  const showTimeAgoPlaceholder = useMemo(() => props.index > 2, [props.index]);

  return (
    <>
      {showDateLabel && (
        <Text c="dimmed" size="12px" key={`label_${entry.id}`}>
          {formatDateLocaleFromTimestamp(entry.created)}
        </Text>
      )}
      <Card key={`card_${entry.id}`} shadow="xs">
        {isRunning && <div className={styles.activeCardIndicator} />}
        <Grid gutter={'4px'}>
          <Grid.Col span={6}>
            <Group align="center" h="100%">
              <Badge variant="outline" size="lg" className={monoStyles.monoFont}>
                {entry.boob === 'Left' ? 'L' : 'R'}
              </Badge>
              <Stack gap={'xxs'} align="start">
                <Group gap={'xs'} justify="end" grow>
                  <Text size="12px" c="dimmed">
                    {t('history-card-label-from')}
                  </Text>
                  <Text size="12px" className={monoStyles.monoFont}>
                    {timeFrom}
                  </Text>
                </Group>
                <Group gap={'xs'} justify="end" w="100%" grow>
                  <Text size="12px" c="dimmed">
                    {t('history-card-label-to')}
                  </Text>
                  <Text size="12px" className={monoStyles.monoFont}>
                    {timeTo}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Grid.Col>
          <Grid.Col span={3}>
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
                {t('history-card-label-duration')}
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={3}>
            {showTimeAgo && (
              <Stack
                gap="0"
                align="end"
                className={showTimeAgoPlaceholder ? styles.timeAgoPlaceholder : ''}
              >
                {!showTimeAgoPlaceholder && (
                  <Timer isRunning isStopped={false} startingSeconds={Math.floor(timeAgo / 1000)}>
                    {(timer) => (
                      <>
                        <Text className={monoStyles.monoFont}>
                          {formatTime(timer.seconds, false)}
                        </Text>
                        <Text size="12px" c="dimmed">
                          {timer.seconds > 60 * 60
                            ? t('history-card-label-hours-ago')
                            : t('history-card-label-min-ago')}
                        </Text>
                      </>
                    )}
                  </Timer>
                )}
              </Stack>
            )}
          </Grid.Col>
        </Grid>
        <Group justify="space-between"></Group>
      </Card>
    </>
  );
}
