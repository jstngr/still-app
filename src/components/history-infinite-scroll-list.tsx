import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { VariableSizeList as List } from 'react-window';
import { IFeedingEntry } from 'shared/types/types';
import HistoryCard from './history-card';
import { Box, Flex, Stack } from '@mantine/core';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import AutoSizer from 'react-virtualized-auto-sizer';

interface IInfiniteScrollListProps {
  data: IFeedingEntry[];
  ItemComponent: React.ReactNode;
}

const SIZE_WITH_LABEL = 69 + 20 + 8;
const SIZE_WITHOUT_LABEL = 69 + 8;

const Item = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: IFeedingEntry[];
}) => {
  return (
    <Flex
      key={`wrapper_${data[index].id}`}
      align="center"
      style={style}
      py={'4px'}
      px="4px"
      flex="1 0 0"
    >
      <Stack gap="8px" flex="1 0 0">
        <HistoryCard entry={data[index]} index={index} />
      </Stack>
    </Flex>
  );
};

export default function HistoryInfiniteScrollList(props: IInfiniteScrollListProps) {
  const {} = useInView();
  const { data } = props;
  const listRef = useRef<List>(null);

  const getItemSize = (index: number) => {
    const prevEntry = data[index - 1];
    if (
      !prevEntry ||
      formatDateFromTimestamp(prevEntry.created) !== formatDateFromTimestamp(data[index].created)
    ) {
      return SIZE_WITH_LABEL;
    }
    return SIZE_WITHOUT_LABEL;
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  }, [data?.length]);

  return (
    <Box flex="1 0 0" w="calc(100% + 8px)" ml="-4px" h={'100%'}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            itemCount={data.length}
            itemSize={getItemSize}
            itemData={data}
          >
            {Item}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
}
