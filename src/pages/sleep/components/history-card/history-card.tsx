import { ActionIcon, Badge, Box, Card, Flex, Grid, Group, Stack, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import formatTime from 'shared/helpers/format-time';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { ISleepEntry } from 'shared/types/types';
import Timer from '../../../../components/timer';
import styles from './history-card.module.css';
import { IconPencil, IconZzz } from '@tabler/icons-react';
import formatSecondsToMinutesSeconds from 'shared/helpers/format-seconds-to-minutes-seconds';
import listItemStyles from 'components/list-item.module.css';
import SleepEntry from 'classes/sleep-entry.class';
import { useSleepContext } from 'service/sleep.service';

interface IHistoryCardProps {
  entry: ISleepEntry;
  index: number;
}

export default function HistoryCard(props: IHistoryCardProps) {
  const { entry, index } = props;
  const { t } = useTranslation();

  const { sleepEntries, editSleepEntryDrawer, activeSleep } = useSleepContext();

  const showDateLabel = useMemo(() => {
    const prevEntry = sleepEntries[index - 1];
    return (
      !prevEntry ||
      formatDateFromTimestamp(prevEntry.created) !== formatDateFromTimestamp(entry.created)
    );
  }, [sleepEntries]);

  const { isRunning, timeAgo, timeFrom, timeTo } = useMemo(() => {
    const sleepEntry = new SleepEntry(entry);
    return {
      isRunning: sleepEntry.isRunning(),
      timeAgo: sleepEntry.getTimeAgo(),
      timeFrom: formatTimeFromTimestamp(sleepEntry.getStarted()),
      timeTo: formatTimeFromTimestamp(sleepEntry.getStopped()),
    };
  }, [entry]);

  const showTimeAgo = useMemo(() => !isRunning && props.index < 1, [isRunning]);

  const onClickEdit = () => {
    if (!entry?.id) {
      return;
    }
    editSleepEntryDrawer.openSleepEntryDrawer(entry.id);
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
            <Badge w="2.5rem" variant="outline" size="lg" className={monoStyles.monoFont}>
              <Flex>
                <IconZzz size={14} stroke={2} />
              </Flex>
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
                  isRunning={!!isRunning}
                  isStopped={false}
                  startingSeconds={Math.floor(new SleepEntry(entry).getDuration() / 1000)}
                >
                  {(timer) => (
                    <Text className={monoStyles.monoFont}>
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
            disabled={activeSleep?.id === entry.id}
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
