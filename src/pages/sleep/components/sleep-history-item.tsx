import { Stack } from '@mantine/core';
import { IconBedFlat } from '@tabler/icons-react';
import SleepEntry from 'classes/sleep-entry.class';
import BaseHistoryItem from 'components/history/BaseHistoryItem';
import DurationDisplay from 'components/history/DurationDisplay';
import IconBadge from 'components/history/IconBadge';
import TimeDisplay from 'components/history/TimeDisplay';
import { useHistoryEdit } from 'components/history/useHistoryEdit';
import { useHistoryEntry } from 'components/history/useHistoryEntry';
import React from 'react';
import { useSleepContext } from 'service/sleep.service';
import { SleepHistoryItemProps } from 'shared/types/history-item.types';

export default function SleepHistoryItem({
  index,
  style,
  data,
}: SleepHistoryItemProps): React.ReactNode {
  const { editSleepEntryDrawer, activeSleep } = useSleepContext();

  const { handleEdit } = useHistoryEdit({
    data,
    onEdit: (id) => editSleepEntryDrawer.openSleepEntryDrawer(id),
  });

  const renderContent = (entry: SleepHistoryItemProps['data'][0]) => {
    const sleepEntry = new SleepEntry(entry);
    const { timeFrom, timeTo, durationInSeconds, isEntryRunning } = useHistoryEntry({
      entry,
      getDuration: () => sleepEntry.getDuration(),
      isRunning: () => sleepEntry.isRunning(),
    });

    return (
      <Stack gap="0">
        <TimeDisplay startTime={timeFrom} endTime={timeTo} />
        <DurationDisplay isRunning={isEntryRunning} durationInSeconds={durationInSeconds} />
      </Stack>
    );
  };

  return (
    <BaseHistoryItem
      index={index}
      style={style}
      data={data}
      icon={<IconBadge icon={<IconBedFlat size={14} stroke={2} />} />}
      onEdit={handleEdit}
      isActive={activeSleep?.id === data[index].id}
      renderContent={renderContent}
    />
  );
}
