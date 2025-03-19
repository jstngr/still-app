import { Flex, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';

import formatTime from 'shared/helpers/format-time';
import monoStyles from 'shared/styles/mono-styles.module.css';

interface ITimeAgoTimerProps {
  tooLongAgoLabel: string;
  sinceLabel: string;
  timeAgo: number;
  hasNoPreviousEntry?: boolean;
  noEntryLabel: string;
}

export default function TimeAgoTimer(props: ITimeAgoTimerProps) {
  // Use state instead of Timer component
  const [seconds, setSeconds] = useState(Math.floor(props.timeAgo / 1000));

  // Update seconds directly with requestAnimationFrame
  useEffect(() => {
    // Set initial seconds based on timeAgo
    setSeconds(Math.floor(props.timeAgo / 1000));

    // Reference time when this timer started
    const startTime = Date.now() - props.timeAgo;
    let frameId: number;

    const updateTimer = () => {
      const elapsedMs = Date.now() - startTime;
      setSeconds(Math.floor(elapsedMs / 1000));
      frameId = requestAnimationFrame(updateTimer);
    };

    frameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [props.timeAgo]);

  if (props.hasNoPreviousEntry || props.timeAgo < 0) {
    return (
      <Flex h="42px" align="center" direction="column">
        <Text size="sm" c="dimmed" maw={200} ta="center">
          {props.noEntryLabel}
        </Text>
      </Flex>
    );
  }
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
        {formatTime(seconds)}
      </Text>
    </Flex>
  );
}
