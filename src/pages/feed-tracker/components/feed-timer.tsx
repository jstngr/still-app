import { Flex, Text } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useMemo } from 'react';
import { useFeedingContext } from 'service/feeding.service';

import formatTime from 'shared/helpers/format-time';
import monoStyles from 'shared/styles/mono-styles.module.css';
import Timer from '../../../components/timer';

export default function FeedTimer() {
  const { activeFeeding } = useFeedingContext();

  const isRunning = useMemo(
    () => activeFeeding && new FeedingEntry(activeFeeding).isRunning(),
    [activeFeeding],
  );

  return (
    <Flex>
      <Text size="32px" className={monoStyles.monoFont}>
        <Timer
          isRunning={!!isRunning}
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
