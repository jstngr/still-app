import { ActionIcon, Badge, Box, Card, Grid, Group, Stack, Text } from '@mantine/core';
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
import Timer from '../../../../components/timer';
import styles from './history-card.module.css';
import { IconPencil } from '@tabler/icons-react';
import formatSecondsToMinutesSeconds from 'shared/helpers/format-seconds-to-minutes-seconds';
import listItemStyles from 'components/list-item.module.css';

interface IHistoryCardProps {
  entry: IFeedingEntry;
  index: number;
}

export default function HistoryCard(props: IHistoryCardProps) {
  const { entry, index } = props;
  const { t } = useTranslation();

  const { feedingEntries, editFeedingEntryDrawer, activeFeeding } = useFeedingContext();

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

  const showTimeAgo = useMemo(
    () => !isRunning && !isPaused && props.index < 2,
    [isPaused, isRunning],
  );

  const onClickEdit = () => {
    if (entry?.id !== undefined) {
      editFeedingEntryDrawer.openFeedingEntryDrawer(entry.id);
    }
  };

  return (
    <>
      {showDateLabel && (
        <Box bg="background.1" p="4px">
          <Text c="dimmed" size="12px" key={`label_${entry.id}`}>
            {formatDateLocaleFromTimestamp(entry.created)}
          </Text>
        </Box>
      )}
      <Card
        radius={0}
        py="xs"
        px="xs"
        key={`card_${entry.id}`}
        bg="background.0"
        className={showDateLabel ? '' : listItemStyles.dashedBorderTop}
      >
        {isRunning && <div className={styles.activeCardIndicator} />}
        <Group justify="space-between" gap="xs">
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
          <Grid gutter="4px" flex="1">
            <Grid.Col span={6}>
              <Stack gap="0" align="end">
                <Timer
                  isRunning={!!(isRunning && !isPaused)}
                  isStopped={false}
                  startingSeconds={Math.floor(new FeedingEntry(entry).getDuration() / 1000)}
                >
                  {(timer) => (
                    <Text className={`${monoStyles.monoFont} ${isPaused && monoStyles.blinking}`}>
                      {formatSecondsToMinutesSeconds(timer.seconds)}
                    </Text>
                  )}
                </Timer>
                <Text size="12px" c="dimmed">
                  {t('history-card-label-duration')}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              {showTimeAgo ? (
                <Stack gap="0" align="end">
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
                </Stack>
              ) : (
                <span></span>
              )}
            </Grid.Col>
          </Grid>

          <ActionIcon
            disabled={activeFeeding?.id === entry.id}
            variant="subtle"
            size="md"
            onClick={onClickEdit}
          >
            <IconPencil stroke="1" size="20" />
          </ActionIcon>
        </Group>
      </Card>
    </>
  );
}
