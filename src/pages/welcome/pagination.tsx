import { Group, ThemeIcon } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';
import React from 'react';

export default function Pagination({ active }: { active: number }) {
  const getColor = (index: number) => (active === index ? 'primary.3' : 'primary.1');
  return (
    <Group gap="0">
      <ThemeIcon c={getColor(0)} variant="transparent">
        <IconPointFilled size="16px" />
      </ThemeIcon>
      <ThemeIcon c={getColor(1)} variant="transparent">
        <IconPointFilled size="16px" />
      </ThemeIcon>
      <ThemeIcon c={getColor(2)} variant="transparent">
        <IconPointFilled size="16px" />
      </ThemeIcon>
      <ThemeIcon c={getColor(3)} variant="transparent">
        <IconPointFilled size="16px" />
      </ThemeIcon>
    </Group>
  );
}
