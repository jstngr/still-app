import {
  ActionIcon,
  Badge,
  BadgeVariant,
  Box,
  Card,
  Flex,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IFeedingEntry, IFeedingType } from 'shared/types/types';
import styles from './history-card.module.css';
import { IconBabyBottle, IconClockPlay, IconClockStop, IconPencil } from '@tabler/icons-react';
import listItemStyles from 'components/list-item.module.css';
import { useSettingsContext } from 'service/settings.service';
import Timer from 'components/timer';
import formatSecondsToMinutesSeconds from 'shared/helpers/format-seconds-to-minutes-seconds';
import formatTime from 'shared/helpers/format-time';

interface IHistoryCardProps {
  entry: IFeedingEntry;
  index: number;
}

function TypeBadge(props: { type: IFeedingType }) {
  const { t } = useTranslation();
  let content: string | React.ReactElement = '';
  let variant: BadgeVariant = 'filled';

  if (props.type === 'Bottle') {
    content = (
      <Flex>
        <IconBabyBottle size={14} stroke={2} />
      </Flex>
    );
    variant = 'outline';
  }
  if (props.type === 'Left') content = t('upperletter-left');
  if (props.type === 'Right') content = t('upperletter-right');
  return (
    <Badge
      w="2.5rem"
      variant={variant}
      color={props.type === 'Left' ? 'blue' : 'primary'}
      size="lg"
      className={monoStyles.monoFont}
    >
      {content}
    </Badge>
  );
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

  const { feedingEntries, editFeedingEntryDrawer, editBottleFeedingEntryDrawer, activeFeeding } =
    useFeedingContext();
  const { feedingUnit } = useSettingsContext();

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
      timeTo: feedingEntry.getStopped()
        ? formatTimeFromTimestamp(feedingEntry.getStopped())
        : '--:--',
    };
  }, [entry]);

  const showTimeAgo = useMemo(
    () => !isRunning && !isPaused && props.index === 0,
    [isPaused, isRunning],
  );

  const onClickEdit = () => {
    if (!entry?.id) {
      return;
    }
    if (entry.type === 'Bottle') {
      editBottleFeedingEntryDrawer.openBottleFeedingEntryDrawer(entry.id);
      return;
    }
    editFeedingEntryDrawer.openFeedingEntryDrawer(entry.id);
  };

  const isBottle = entry.type === 'Bottle';

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
          <TypeBadge type={entry.type} />
          <Stack gap="0">
            <Group gap="xxs" align="center" className={monoStyles.monoFont}>
              <IconClockPlay size="16px" color="var(--mantine-color-background-3)" />
              <Text size="sm">{timeFrom}</Text>
              <Text size="sm" opacity={isBottle ? 0 : 1}>
                -
              </Text>
              <IconClockStop
                opacity={isBottle ? 0 : 1}
                size="16px"
                color="var(--mantine-color-background-3)"
              />
              <Text size="sm" opacity={isBottle ? 0 : 1}>
                {timeTo}
              </Text>
            </Group>

            {isBottle && (
              <Text size="sm">
                {t('history-card-label-volume', { volume: entry.volume || 0, unit: feedingUnit })}
              </Text>
            )}
            {!isBottle && (
              <Timer
                isRunning={!!(isRunning && !isPaused)}
                isStopped={false}
                startingSeconds={Math.floor(new FeedingEntry(entry).getDuration() / 1000)}
              >
                {(timer) => (
                  <Text size="sm">
                    {timer.seconds < 60 && isRunning ? (
                      t('history-card-label-just-started')
                    ) : (
                      <Trans
                        i18nKey="history-card-label-duration"
                        components={{
                          Mono: (
                            <Text
                              component="span"
                              className={`${monoStyles.monoFont} ${isPaused && monoStyles.blinking}`}
                            />
                          ),
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
            )}
          </Stack>
          {showTimeAgo && <TimeAgo timeAgo={timeAgo} />}
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
