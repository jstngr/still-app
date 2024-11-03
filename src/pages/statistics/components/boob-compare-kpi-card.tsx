import { PieChart } from '@mantine/charts';
import { Card, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Styles from './boob-compare-kpi-card.module.css';

interface IBoobCompareKpiCardProps {
  left?: number;
  right?: number;
}

export default function BoobCompareKpiCard(props: IBoobCompareKpiCardProps) {
  const { left = 0, right = 0 } = props;
  const { t } = useTranslation();

  return (
    <Card w="100%" shadow="xs">
      <Stack gap="sm">
        <Group align="center">
          <PieChart
            className={Styles.root}
            size={56}
            withTooltip={false}
            w={56}
            h={56}
            data={[
              { name: 'Left', value: left, color: 'blue.2' },
              { name: 'Right', value: right, color: 'primary.2' },
            ]}
            tooltipProps={{
              active: false,
              cursor: false,
            }}
          />
          <Stack gap="xxs" justify="space-between">
            <Group align="end" gap="sm">
              <Title order={1} lh="1">
                {left}
              </Title>
              <Title order={5}>{t('boob-compare-kpi-card-title-left')}</Title>
              <Title order={1} lh="1">
                {right}
              </Title>
              <Title order={5}>{t('boob-compare-kpi-card-title-right')}</Title>
            </Group>
            <Text size="sm" lh="1">
              {t('boob-compare-kpi-card-subtitle')}
            </Text>
          </Stack>
        </Group>
      </Stack>
    </Card>
  );
}
