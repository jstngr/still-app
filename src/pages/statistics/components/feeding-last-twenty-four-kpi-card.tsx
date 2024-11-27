import { Card, Stack, Group, ThemeIcon, Title, Text } from '@mantine/core';
import { IconBabyBottle } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IFeedingLastTwentyFourKpiCardProps {
  value?: number;
}

export default function FeedingLastTwentyFourKpiCard(props: IFeedingLastTwentyFourKpiCardProps) {
  const { value = 0 } = props;
  const { t } = useTranslation();

  return (
    <Card w="100%" withBorder>
      <Stack gap="sm">
        <Group align="center">
          <ThemeIcon
            radius="xl"
            size={56}
            variant="gradient"
            gradient={{ from: 'primary.3', to: 'primary.2', deg: 45 }}
          >
            <IconBabyBottle style={{ width: '70%', height: '70%' }} />
          </ThemeIcon>
          <Stack gap="xxs" justify="space-between">
            <Group align="end" gap="sm">
              <Title order={1} lh="1">
                {value}
              </Title>
              <Title order={5}>{t('feeding-last-twenty-four-kpi-card-title')}</Title>
            </Group>
            <Text size="sm" lh="1">
              {t('feeding-last-twenty-four-kpi-card-subtitle')}
            </Text>
          </Stack>
        </Group>
      </Stack>
    </Card>
  );
}
