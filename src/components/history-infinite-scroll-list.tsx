import { Box, CSSProperties } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';

interface IInfiniteScrollListProps<T> {
  data: T[];
  cardBaseSize: number;
  ItemComponent: ({
    index,
    style,
    data,
  }: {
    index: number;
    style: CSSProperties;
    data: T[];
  }) => React.ReactNode;
}

interface Entry {
  created: number;
}

export default function HistoryInfiniteScrollList<T extends Entry>(
  props: IInfiniteScrollListProps<T>
) {
  const {} = useInView();
  const { data, ItemComponent, cardBaseSize } = props;
  const listRef = useRef<List>(null);

  const SIZE_WITH_LABEL = cardBaseSize + 20;
  const SIZE_WITHOUT_LABEL = cardBaseSize;

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
            {ItemComponent}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
}
