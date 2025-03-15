import { Flex, Stack } from '@mantine/core';
import React, { useMemo } from 'react';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import { BaseEntry, BaseHistoryItemProps } from './types/history-item.types';
import BaseHistoryCard from './BaseHistoryCard';

export default function BaseHistoryItem<T extends BaseEntry>({
  index,
  style,
  data,
  icon,
  onEdit,
  isActive,
  renderContent,
}: BaseHistoryItemProps<T>) {
  const entry = data[index];

  const showDateLabel = useMemo(() => {
    const prevEntry = data[index - 1];
    return (
      !prevEntry ||
      formatDateFromTimestamp(prevEntry.created) !== formatDateFromTimestamp(entry.created)
    );
  }, [data, index, entry]);

  return (
    <Flex key={`wrapper_${entry.id}`} align="center" style={style} p="4px" flex="1 0 0">
      <Stack gap="0" flex="1 0 0">
        <BaseHistoryCard
          entry={entry}
          showDateLabel={showDateLabel}
          isActive={isActive}
          icon={icon}
          onEdit={onEdit}
        >
          {renderContent(entry)}
        </BaseHistoryCard>
      </Stack>
    </Flex>
  );
}
