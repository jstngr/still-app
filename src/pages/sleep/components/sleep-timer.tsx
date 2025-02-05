import { Flex, Text } from '@mantine/core';
import React, { useMemo } from 'react';

import formatTime from 'shared/helpers/format-time';
import monoStyles from 'shared/styles/mono-styles.module.css';
import Timer from '../../../components/timer';
import { useSleepContext } from 'service/sleep.service';
import SleepEntry from 'classes/sleep-entry.class';

export default function SleepTimer() {
  const { activeSleep } = useSleepContext();

  const isRunning = useMemo(
    () => activeSleep && new SleepEntry(activeSleep).isRunning(),
    [activeSleep],
  );

  return (
    <Flex h="42px" align="center">
      <Text size="32px" className={monoStyles.monoFont}>
        <Timer
          isRunning={!!isRunning}
          isStopped={!activeSleep}
          startingSeconds={
            activeSleep ? Math.floor(new SleepEntry(activeSleep).getDuration() / 1000) : 0
          }
          timerId={activeSleep?.id}
        >
          {(timer) => <>{formatTime(timer.seconds)}</>}
        </Timer>
      </Text>
    </Flex>
  );
}
