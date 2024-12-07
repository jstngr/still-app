import { ScrollArea, Container, Stack, Card, Group, ThemeIcon, Divider, Text } from '@mantine/core';
import {
  IconBabyBottle,
  IconDroplet,
  IconSwitchHorizontal,
  IconPoo,
  IconBedFlatFilled,
} from '@tabler/icons-react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';
import monoStyles from 'shared/styles/mono-styles.module.css';
import useLast24Hours from '../hooks/use-last-24-hours';

export default function Last24Hours() {
  const { feedByBoob, feedByBottle, poopTrackerEnabled, sleepTrackerEnabled, feedingUnit } =
    useSettingsContext();
  const { t } = useTranslation();

  const {
    chunks,
    averageChunkDuration,
    boobDistribution,
    averageDurationLeft,
    averageDurationRight,
    averageBottleVolume,
    bottleAmount,
    poopEntries,
    averagePoopDistance,
  } = useLast24Hours();

  return (
    <ScrollArea h="100%">
      <Container fluid w="100%" pb="8px">
        <Card withBorder>
          <Stack gap="lg">
            {feedByBottle && (
              <Group wrap="nowrap" align="start">
                <ThemeIcon radius="50%" size="xl" variant="outline">
                  <IconBabyBottle />
                </ThemeIcon>
                <Stack gap="0" justify="space-between">
                  <Group gap="xxs" align="end">
                    <Text size="24px" className={monoStyles.monoFont}>
                      {bottleAmount}
                    </Text>
                    <Text>{t('statistics-page-24-hours-bottle-title')}</Text>
                  </Group>
                  <Text size="sm">
                    <Trans
                      i18nKey="statistics-page-24-hours-bottle-subtitle"
                      components={{
                        Big: <strong className={monoStyles.monoFont} />,
                      }}
                      values={{ averageBottleVolume, feedingUnit }}
                    />
                  </Text>
                </Stack>
              </Group>
            )}

            {feedByBottle && (feedByBoob || poopTrackerEnabled || sleepTrackerEnabled) && (
              <Divider />
            )}

            {feedByBoob && (
              <>
                <Stack>
                  <Group wrap="nowrap" align="start">
                    <ThemeIcon radius="50%" size="xl" variant="outline">
                      <IconDroplet />
                    </ThemeIcon>
                    <Stack gap="0">
                      <Group gap="xxs">
                        <Text size="24px" className={monoStyles.monoFont}>
                          {chunks.length}
                        </Text>
                        <Text>{t('statistics-page-24-hours-breast-title')}</Text>
                      </Group>

                      <Text size="sm">
                        <Trans
                          i18nKey="statistics-page-24-hours-breast-subtitle"
                          components={{
                            Big: <strong className={monoStyles.monoFont} />,
                          }}
                          values={{ averageChunkDuration }}
                        />
                      </Text>
                    </Stack>
                  </Group>
                  <Text size="xs">{t('statistics-page-24-hours-breast-hint')}</Text>
                </Stack>

                <Group wrap="nowrap" align="start">
                  <ThemeIcon radius="50%" size="xl" variant="outline">
                    <IconSwitchHorizontal />
                  </ThemeIcon>
                  <Stack gap="0" justify="space-between">
                    <Text>{t('statistics-page-24-hours-breast-distribution-title')}</Text>
                    <Text size="sm">
                      <Trans
                        i18nKey="statistics-page-24-hours-breast-distribution-subtitle-left"
                        components={{
                          Big: <strong className={monoStyles.monoFont} />,
                        }}
                        values={{
                          boobDistribution: boobDistribution?.Left || 0,
                          averageDuration: averageDurationLeft,
                        }}
                      />
                    </Text>
                    <Text size="sm">
                      <Trans
                        i18nKey="statistics-page-24-hours-breast-distribution-subtitle-right"
                        components={{
                          Big: <strong className={monoStyles.monoFont} />,
                        }}
                        values={{
                          boobDistribution: boobDistribution?.Right || 0,
                          averageDuration: averageDurationRight,
                        }}
                      />
                    </Text>
                  </Stack>
                </Group>
              </>
            )}

            {feedByBoob && (poopTrackerEnabled || sleepTrackerEnabled) && <Divider />}

            {poopTrackerEnabled && (
              <Stack gap="sm">
                <Group wrap="nowrap" align="start">
                  <ThemeIcon radius="50%" size="xl" variant="outline">
                    <IconPoo />
                  </ThemeIcon>
                  <Stack gap="0" justify="space-between">
                    <Group gap="xxs" align="end">
                      <Text size="24px" className={monoStyles.monoFont}>
                        {poopEntries?.length}
                      </Text>
                      <Text>{t('statistics-page-24-hours-poop-title')}</Text>
                    </Group>
                    <Text size="sm">
                      <Trans
                        i18nKey="statistics-page-24-hours-poop-subtitle"
                        components={{
                          Big: <strong className={monoStyles.monoFont} />,
                        }}
                        values={{
                          averagePoopDistance,
                        }}
                      />
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            )}

            {poopTrackerEnabled && sleepTrackerEnabled && <Divider />}

            {sleepTrackerEnabled && (
              <Stack gap="sm">
                <Group wrap="nowrap" align="start">
                  <ThemeIcon radius="50%" size="xl" variant="outline">
                    <IconBedFlatFilled />
                  </ThemeIcon>
                  <Stack gap="0" justify="space-between">
                    <Group gap="xxs" align="end">
                      <Text size="24px" className={monoStyles.monoFont}>
                        9
                      </Text>
                      <Text>Sleeps recorded</Text>
                    </Group>
                    <Stack gap="0">
                      <Text size="sm">
                        Average length of <strong className={monoStyles.monoFont}>30</strong>min
                      </Text>
                      <Text size="sm">
                        Total length of <strong className={monoStyles.monoFont}>5</strong>hr
                      </Text>
                    </Stack>
                  </Stack>
                </Group>
              </Stack>
            )}
          </Stack>
        </Card>
      </Container>
    </ScrollArea>
  );
}
