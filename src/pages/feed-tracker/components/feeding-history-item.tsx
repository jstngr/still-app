import { Stack, Text } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import BaseHistoryItem from 'components/history/BaseHistoryItem';
import DurationDisplay from 'components/history/DurationDisplay';
import FeedingTypeBadge from 'components/history/FeedingTypeBadge';
import TimeDisplay from 'components/history/TimeDisplay';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { useSettingsContext } from 'service/settings.service';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import { IFeedingEntry } from 'shared/types/types';

export default function FeedingHistoryItem({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: IFeedingEntry[];
}): React.ReactNode {
  const { editFeedingEntryDrawer, editBottleFeedingEntryDrawer, activeFeeding } =
    useFeedingContext();
  const { feedingUnit } = useSettingsContext();
  const { t } = useTranslation();

  const handleEdit = (id: number) => {
    const entry = data.find((e) => e.id === id);
    if (!entry) return;

    if (entry.type === 'Bottle') {
      editBottleFeedingEntryDrawer.openBottleFeedingEntryDrawer(id);
    } else {
      editFeedingEntryDrawer.openFeedingEntryDrawer(id);
    }
  };

  const renderContent = (entry: IFeedingEntry) => {
    const feedingEntry = new FeedingEntry(entry);
    const isRunning = feedingEntry.isRunning();
    const timeFrom = formatTimeFromTimestamp(feedingEntry.getStarted());
    const timeTo = feedingEntry.getStopped()
      ? formatTimeFromTimestamp(feedingEntry.getStopped())
      : '--:--';
    const isBottle = entry.type === 'Bottle';

    return (
      <Stack gap="0">
        <TimeDisplay startTime={timeFrom} endTime={timeTo} showEndTime={!isBottle} />

        {isBottle && (
          <Text size="sm">
            {t('history-card-label-volume', { volume: entry.volume || 0, unit: feedingUnit })}
          </Text>
        )}
        {!isBottle && (
          <DurationDisplay
            isRunning={isRunning}
            durationInSeconds={Math.floor(feedingEntry.getDuration() / 1000)}
          />
        )}
      </Stack>
    );
  };

  return (
    <BaseHistoryItem
      index={index}
      style={style}
      data={data}
      icon={<FeedingTypeBadge type={data[index].type} />}
      onEdit={handleEdit}
      isActive={activeFeeding?.id === data[index].id}
      renderContent={renderContent}
    />
  );
}
