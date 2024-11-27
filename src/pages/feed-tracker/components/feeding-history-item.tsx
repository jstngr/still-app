import { Flex, Stack } from '@mantine/core';
import React from 'react';
import { IFeedingEntry } from 'shared/types/types';
import HistoryCard from './history-card/history-card';

export default function FeedingHistoryItem({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: IFeedingEntry[];
}): React.ReactNode {
  return (
    <Flex key={`wrapper_${data[index].id}`} align="center" style={style} px="4px" flex="1 0 0">
      <Stack gap="0" flex="1 0 0">
        <HistoryCard entry={data[index]} index={index} />
      </Stack>
    </Flex>
  );
}
