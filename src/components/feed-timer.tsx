import { Flex, Text } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useEffect, useMemo, useState } from 'react';
import { useFeedingContext } from 'service/feeding.service';

import monoStyles from 'shared/styles/mono-styles.module.css';
import formatTime from 'shared/helpers/format-time';
import Timer from './timer';

export default function FeedTimer() {
  const { activeFeeding } = useFeedingContext();

  const isRunning = useMemo(
    () => activeFeeding && new FeedingEntry(activeFeeding).isRunning(),
    [activeFeeding]
  );
  const isPaused = useMemo(
    () => activeFeeding && new FeedingEntry(activeFeeding).isPaused(),
    [activeFeeding]
  );

  return (
    <Flex>
      <Text size="32px" className={`${monoStyles.monoFont} ${isPaused && monoStyles.blinking}`}>
        <Timer
          isRunning={!!(isRunning && !isPaused)}
          isStopped={!activeFeeding}
          startingSeconds={
            activeFeeding ? Math.floor(new FeedingEntry(activeFeeding).getDuration() / 1000) : 0
          }
          timerId={activeFeeding?.id}
        >
          {(timer) => <>{formatTime(timer.seconds)}</>}
        </Timer>
      </Text>
    </Flex>
  );
}
