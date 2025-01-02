import { ActionIcon, Badge, Box, Card, Flex, Group, Stack, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import formatTime from 'shared/helpers/format-time';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { ISleepEntry } from 'shared/types/types';
import Timer from '../../../../components/timer';
import styles from './history-card.module.css';
import { IconClockPlay, IconClockStop, IconPencil, IconZzz } from '@tabler/icons-react';
import formatSecondsToMinutesSeconds from 'shared/helpers/format-seconds-to-minutes-seconds';
import listItemStyles from 'components/list-item.module.css';
import SleepEntry from 'classes/sleep-entry.class';
import { useSleepContext } from 'service/sleep.service';

interface IHistoryCardProps {
  entry: ISleepEntry;
  index: number;
}

function TimeAgo(props: { timeAgo: number }) {
  const { t } = useTranslation();

  const innerTimer = (seconds: number) => {
    if (seconds > 60 * 60) {
      return t('history-card-label-hours-ago', {
        value: formatTime(seconds, false),
      });
    }
    return t('history-card-label-min-ago', {
      value: formatSecondsToMinutesSeconds(seconds, false),
    });
  };

  return (
    <Timer isRunning isStopped={false} startingSeconds={Math.floor(props.timeAgo / 1000)}>
      {(timer) => {
        if (timer.seconds > 12 * 60 * 60) return null;
        return (
          <Text size="xs" component="span" className={monoStyles.monoFont}>
            {innerTimer(timer.seconds)}
          </Text>
        );
      }}
    </Timer>
  );
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
      timeTo: sleepEntry.getStopped() ? formatTimeFromTimestamp(sleepEntry.getStopped()) : '--:--',
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
            {formatDateLocaleFromTimestamp(entry.created, t)}
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
        <Group align="center" justify="space-between" gap="0">
          <Badge w="2.5rem" variant="outline" size="lg" className={monoStyles.monoFont}>
            <Flex>
              <IconZzz size={14} stroke={2} />
            </Flex>
          </Badge>
          <Stack gap="0">
            <Group gap="xxs" align="center" className={monoStyles.monoFont}>
              <IconClockPlay size="16px" color="var(--mantine-color-background-3)" />
              <Text size="sm">{timeFrom}</Text>
              <Text size="sm">-</Text>
              <IconClockStop size="16px" color="var(--mantine-color-background-3)" />
              <Text size="sm">{timeTo}</Text>
            </Group>

            <Timer
              isRunning={!!isRunning}
              isStopped={false}
              startingSeconds={Math.floor(new SleepEntry(entry).getDuration() / 1000)}
            >
              {(timer) => (
                <Text size="sm">
                  {timer.seconds < 60 && isRunning ? (
                    t('history-card-label-just-started')
                  ) : (
                    <Trans
                      i18nKey="history-card-label-duration"
                      components={{
                        Mono: <Text component="span" className={monoStyles.monoFont} />,
                      }}
                      values={{
                        duration: formatSecondsToMinutesSeconds(Math.max(timer.seconds, 60)),
                      }}
                      count={Math.floor(Math.max(timer.seconds, 60) / 60)}
                    />
                  )}
                </Text>
              )}
            </Timer>
          </Stack>
          {showTimeAgo && <TimeAgo timeAgo={timeAgo} />}
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
