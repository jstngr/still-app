import { ScrollArea, Container, Stack, Card, Group, ThemeIcon, Divider, Text } from '@mantine/core';
import {
  IconBabyBottle,
  IconDroplet,
  IconSwitchHorizontal,
  IconPoo,
  IconBedFlatFilled,
} from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';
import monoStyles from 'shared/styles/mono-styles.module.css';
import useLast24Hours from '../hooks/use-last-24-hours';

export default function Last24Hours() {
  const { feedByBoob, feedByBottle, poopTrackerEnabled, sleepTrackerEnabled, feedingUnit } =
    useSettingsContext();
  const { t } = useTranslation();

  const {} = useLast24Hours();

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
                      5
                    </Text>
                    <Text>Bottle Feedings</Text>
                  </Group>
                  <Text size="sm">
                    with in average <strong className={monoStyles.monoFont}>149</strong>
                    {feedingUnit}
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
                          9
                        </Text>
                        <Text>Breast Feedings</Text>
                      </Group>

                      <Text size="sm">
                        with average length of <strong className={monoStyles.monoFont}>15</strong>{' '}
                        minutes
                      </Text>
                    </Stack>
                  </Group>
                  <Text size="xs">
                    {'>'} Feeding entries are grouped based on how close they are in time. If there
                    {"'"}s a break of more than 30 minutes, a new feeding session starts.
                  </Text>
                </Stack>

                <Group wrap="nowrap" align="start">
                  <ThemeIcon radius="50%" size="xl" variant="outline">
                    <IconSwitchHorizontal />
                  </ThemeIcon>
                  <Stack gap="0" justify="space-between">
                    <Text>Distributed over boobs</Text>
                    <Text size="sm">
                      <strong className={monoStyles.monoFont}>5</strong> Left (average{' '}
                      <strong className={monoStyles.monoFont}>10</strong>min)
                    </Text>
                    <Text size="sm">
                      <strong className={monoStyles.monoFont}>4</strong> Right (average{' '}
                      <strong className={monoStyles.monoFont}>9</strong>min)
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
                        9
                      </Text>
                      <Text>Poo{"'"}s recorded</Text>
                    </Group>
                    <Text size="sm">
                      In average all <strong className={monoStyles.monoFont}>2:30</strong> hours
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
