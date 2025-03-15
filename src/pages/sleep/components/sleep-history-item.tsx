import { Badge, Flex, Stack } from '@mantine/core';
import { IconBedFlat } from '@tabler/icons-react';
import SleepEntry from 'classes/sleep-entry.class';
import BaseHistoryItem from 'components/history/BaseHistoryItem';
import DurationDisplay from 'components/history/DurationDisplay';
import TimeDisplay from 'components/history/TimeDisplay';
import React from 'react';
import { useSleepContext } from 'service/sleep.service';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { ISleepEntry } from 'shared/types/types';

export default function SleepHistoryItem({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: ISleepEntry[];
}): React.ReactNode {
  const { editSleepEntryDrawer, activeSleep } = useSleepContext();

  const handleEdit = (id: number) => {
    editSleepEntryDrawer.openSleepEntryDrawer(id);
  };

  const renderContent = (entry: ISleepEntry) => {
    const sleepEntry = new SleepEntry(entry);
    const isRunning = sleepEntry.isRunning();
    const timeFrom = formatTimeFromTimestamp(sleepEntry.getStarted());
    const timeTo = sleepEntry.getStopped()
      ? formatTimeFromTimestamp(sleepEntry.getStopped())
      : '--:--';

    return (
      <Stack gap="0">
        <TimeDisplay startTime={timeFrom} endTime={timeTo} />
        <DurationDisplay
          isRunning={isRunning}
          durationInSeconds={Math.floor(sleepEntry.getDuration() / 1000)}
        />
      </Stack>
    );
  };

  return (
    <BaseHistoryItem
      index={index}
      style={style}
      data={data}
      icon={
        <Badge
          w="2.5rem"
          variant="outline"
          color="primary"
          size="lg"
          className={monoStyles.monoFont}
        >
          <Flex>
            <IconBedFlat size={14} stroke={2} />
          </Flex>
        </Badge>
      }
      onEdit={handleEdit}
      isActive={activeSleep?.id === data[index].id}
      renderContent={renderContent}
    />
  );
}
