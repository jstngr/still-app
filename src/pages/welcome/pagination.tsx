import { Group, Text } from '@mantine/core';
import React from 'react';
import monoStyles from 'shared/styles/mono-styles.module.css';

export default function Pagination({ active }: { active: number }) {
  const getColor = (index: number) => (active === index ? 'primary.3' : 'primary.2');
  const getSize = (index: number) => (active === index ? '1.25rem' : 'sm');

  return (
    <Group
      align="baseline"
      mt="1rem"
      gap="xs"
      className={monoStyles.monoFont + ' ' + monoStyles.alignBaseline}
    >
      <Text c={getColor(0)} component="span" size={getSize(0)} lh="1">
        1
      </Text>
      <Text c={getColor(1)} component="span" size={getSize(1)}>
        2
      </Text>
      <Text c={getColor(2)} component="span" size={getSize(2)}>
        3
      </Text>
      <Text c={getColor(3)} component="span" size={getSize(3)}>
        4
      </Text>
      <Text c={getColor(4)} component="span" size={getSize(4)}>
        5
      </Text>
    </Group>
  );
}
