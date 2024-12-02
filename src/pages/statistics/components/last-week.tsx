import {
  ScrollArea,
  Container,
  Card,
  Stack,
  Table,
  Badge,
  Flex,
  Text,
  Group,
  ThemeIcon,
} from '@mantine/core';
import monoStyles from 'shared/styles/mono-styles.module.css';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';
import { IconBabyBottle, IconPoo } from '@tabler/icons-react';
import styles from './last-week.module.css';
import getLast7Days from 'shared/helpers/get-last-7-days';

export default function LastWeek() {
  const { feedByBoob, feedByBottle, poopTrackerEnabled, sleepTrackerEnabled, feedingUnit } =
    useSettingsContext();
  const { t } = useTranslation();

  const weekDays = useMemo(getLast7Days, []);

  const data = weekDays.map((dayKey) => ({
    day: t(`week-day-${dayKey}`),
  }));
  const feedingRows = data.map((d) => (
    <Table.Tr key={d.day}>
      <Table.Td>{d.day}</Table.Td>
      <Table.Td>{'5:30 (9x)'}</Table.Td>
      <Table.Td>{'4:80 (8x)'}</Table.Td>
      <Table.Td>
        {'250'} {feedingUnit}
      </Table.Td>
    </Table.Tr>
  ));

  const poopRows = data.map((d) => (
    <Table.Tr key={d.day}>
      <Table.Td>{d.day}</Table.Td>
      <Table.Td>10</Table.Td>
      <Table.Td>60 min</Table.Td>
    </Table.Tr>
  ));

  const sleepRows = data.map((d) => (
    <Table.Tr key={d.day}>
      <Table.Td>{d.day}</Table.Td>
      <Table.Td>10</Table.Td>
      <Table.Td>60 min</Table.Td>
      <Table.Td>600 min</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h="100%">
      <Container fluid w="100%" pb="8px">
        <Stack>
          <Card withBorder>
            <Stack>
              <Group wrap="nowrap" align="center">
                <ThemeIcon radius="50%" size="xl" variant="outline">
                  <IconBabyBottle />
                </ThemeIcon>
                <Text>Feeding Breakdown by Boob and Bottle</Text>
              </Group>

              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th>
                      <Badge w="2.5rem" variant="outline" size="lg" className={monoStyles.monoFont}>
                        L
                      </Badge>
                    </Table.Th>
                    <Table.Th>
                      <Badge w="2.5rem" variant="outline" size="lg" className={monoStyles.monoFont}>
                        R
                      </Badge>
                    </Table.Th>
                    <Table.Th>
                      <Badge w="2.5rem" variant="outline" size="lg" className={monoStyles.monoFont}>
                        <Flex>
                          <IconBabyBottle size={14} stroke={2} />
                        </Flex>
                      </Badge>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className={styles.tableBody}>{feedingRows}</Table.Tbody>
              </Table>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Group wrap="nowrap" align="center">
                <ThemeIcon radius="50%" size="xl" variant="outline">
                  <IconPoo />
                </ThemeIcon>
                <Text>Total Counts and Average Time Between Poops</Text>
              </Group>

              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th className={styles.tableTextTh}>Amount</Table.Th>
                    <Table.Th className={styles.tableTextTh}>Time between</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className={styles.tableBody}>{poopRows}</Table.Tbody>
              </Table>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Group wrap="nowrap" align="center">
                <ThemeIcon radius="50%" size="xl" variant="outline">
                  <IconPoo />
                </ThemeIcon>
                <Text>Sleep Overview with Duration Averages and Sessions</Text>
              </Group>

              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th className={styles.tableTextTh}>Sessions</Table.Th>
                    <Table.Th className={styles.tableTextTh}>Average</Table.Th>
                    <Table.Th className={styles.tableTextTh}>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className={styles.tableBody}>{sleepRows}</Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </ScrollArea>
  );
}
