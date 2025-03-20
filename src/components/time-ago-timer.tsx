import { Flex, Text } from '@mantine/core';
import React, { useEffect, useState, useRef } from 'react';

import formatTime from 'shared/helpers/format-time';
import monoStyles from 'shared/styles/mono-styles.module.css';

interface ITimeAgoTimerProps {
  tooLongAgoLabel: string;
  sinceLabel: string;
  startTime: number;
  hasNoPreviousEntry?: boolean;
  noEntryLabel: string;
}

export default function TimeAgoTimer(props: ITimeAgoTimerProps) {
  const timeAgo = props.startTime ? Date.now() - props.startTime : 0;
  const [seconds, setSeconds] = useState(Math.floor(timeAgo / 1000));
  const frameIdRef = useRef<number>();
  const startTimeRef = useRef(props.startTime);

  useEffect(() => {
    startTimeRef.current = props.startTime;
    setSeconds(Math.floor((Date.now() - props.startTime) / 1000));
  }, [props.startTime]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      setSeconds(Math.floor(elapsed / 1000));
      frameIdRef.current = requestAnimationFrame(updateTimer);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
      } else {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        frameIdRef.current = requestAnimationFrame(updateTimer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    frameIdRef.current = requestAnimationFrame(updateTimer);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  if (props.hasNoPreviousEntry || timeAgo < 0) {
    return (
      <Flex h="42px" align="center" direction="column">
        <Text size="sm" c="dimmed" maw={200} ta="center">
          {props.noEntryLabel}
        </Text>
      </Flex>
    );
  }

  if (timeAgo > 1000 * 60 * 60 * 24) {
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
