import { Group, Text } from '@mantine/core';
import { IconClockPlay, IconClockStop } from '@tabler/icons-react';
import React from 'react';
import monoStyles from 'shared/styles/mono-styles.module.css';

interface TimeDisplayProps {
  startTime: string;
  endTime: string;
  showEndTime?: boolean;
}

export default function TimeDisplay({ startTime, endTime, showEndTime = true }: TimeDisplayProps) {
  return (
    <Group gap="xxs" align="center" className={monoStyles.monoFont}>
      <IconClockPlay size="16px" color="var(--mantine-color-background-3)" />
      <Text size="sm">{startTime}</Text>
      <Text size="sm" opacity={showEndTime ? 1 : 0}>
        -
      </Text>
      <IconClockStop
        opacity={showEndTime ? 1 : 0}
        size="16px"
        color="var(--mantine-color-background-3)"
      />
      <Text size="sm" opacity={showEndTime ? 1 : 0}>
        {endTime}
      </Text>
    </Group>
  );
}
