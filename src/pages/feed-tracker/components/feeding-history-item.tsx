import { Stack, Text } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import BaseHistoryItem from 'components/history/BaseHistoryItem';
import DurationDisplay from 'components/history/DurationDisplay';
import FeedingTypeBadge from 'components/history/FeedingTypeBadge';
import TimeDisplay from 'components/history/TimeDisplay';
import { useHistoryEdit } from 'components/history/useHistoryEdit';
import { useHistoryEntry } from 'components/history/useHistoryEntry';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { useSettingsContext } from 'service/settings.service';
import { FeedingHistoryItemProps } from 'shared/types/history-item.types';

export default function FeedingHistoryItem({
  index,
  style,
  data,
}: FeedingHistoryItemProps): React.ReactNode {
  const { editFeedingEntryDrawer, editBottleFeedingEntryDrawer, activeFeeding } =
    useFeedingContext();
  const { feedingUnit } = useSettingsContext();
  const { t } = useTranslation();

  const { handleEdit } = useHistoryEdit({
    data,
    onEdit: (id) => {
      const entry = data.find((e) => e.id === id);
      if (!entry) return;
      if (entry.type === 'Bottle') {
        editBottleFeedingEntryDrawer.openBottleFeedingEntryDrawer(id);
      } else {
        editFeedingEntryDrawer.openFeedingEntryDrawer(id);
      }
    },
  });

  const renderContent = (entry: FeedingHistoryItemProps['data'][0]) => {
    const feedingEntry = new FeedingEntry(entry);
    const { timeFrom, timeTo, durationInSeconds, isEntryRunning } = useHistoryEntry({
      entry,
      getDuration: () => feedingEntry.getDuration(),
      isRunning: () => feedingEntry.isRunning(),
    });
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
          <DurationDisplay isRunning={isEntryRunning} durationInSeconds={durationInSeconds} />
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
