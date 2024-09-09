import { Card, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';

interface IKpiCardProps {
  amount: number;
  title: string;
  text: string;
}

export default function KpiCard(props: IKpiCardProps) {
  const { amount, title, text } = props;

  return (
    <Card shadow="xs" w="150px">
      <Stack gap="xs" align="start">
        <Group wrap="nowrap" gap="0" align="end">
          <Title order={2} lh={1}>
            {amount}
          </Title>
          <Title order={6}>{title}</Title>
        </Group>
        <Text size="xs">{text}</Text>
      </Stack>
    </Card>
  );
}
