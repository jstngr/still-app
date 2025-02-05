import { Flex, Text } from '@mantine/core';
import React from 'react';
import { useFeedingContext } from 'service/feeding.service';

import formatTime from 'shared/helpers/format-time';
import monoStyles from 'shared/styles/mono-styles.module.css';
import Timer from './timer';

interface ITimeAgoTimerProps {
  tooLongAgoLabel: string;
  sinceLabel: string;
  timeAgo: number;
}

export default function TimeAgoTimer(props: ITimeAgoTimerProps) {
  const { feedingEntries } = useFeedingContext();
  const lastEntry = feedingEntries[0];

  if (props.timeAgo > 1000 * 60 * 60 * 24) {
    return (
      <Flex h="42px" align="center" direction="column">
        <Text size="sm" c="dimmed" maw={200} ta="center">
          {props.tooLongAgoLabel}
        </Text>
      </Flex>
    );
  }
  return (
    <Flex h="42px" align="center" direction="column" gap="xxs">
      <Text size="sm" c="dimmed">
        {props.sinceLabel}
      </Text>
      <Text size="20px" className={monoStyles.monoFont}>
        <Timer
          isRunning={true}
          isStopped={false}
          startingSeconds={Math.floor(props.timeAgo / 1000)}
          timerId={lastEntry?.id}
        >
          {(timer) => <>{formatTime(timer.seconds)}</>}
        </Timer>
      </Text>
    </Flex>
  );
}
