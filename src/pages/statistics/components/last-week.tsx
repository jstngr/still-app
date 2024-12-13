import { ScrollArea, Container, Card, Stack, Table, Text, Group, ThemeIcon } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';
import { IconBabyBottle, IconBedFlat, IconDroplet, IconPoo } from '@tabler/icons-react';
import styles from './last-week.module.css';

import useLastWeek from '../hooks/use-last-week';

export default function LastWeek() {
  const { feedingUnit } = useSettingsContext();
  const { t } = useTranslation();

  const { data } = useLastWeek();

  const bottleRows = data.map((d) => {
    if (!d.bottleAmount)
      return (
        <Table.Tr key={d.day}>
          <Table.Td>{d.weekDay}</Table.Td>
          <Table.Td>-</Table.Td>
          <Table.Td>-</Table.Td>
        </Table.Tr>
      );
    return (
      <Table.Tr key={d.day}>
        <Table.Td>{d.weekDay}</Table.Td>
        <Table.Td>
          {d.bottleAverageVolume} {feedingUnit} ({d.bottleAmount}x)
        </Table.Td>
        <Table.Td>
          {d.bottleTotalVolume} {feedingUnit}
        </Table.Td>
      </Table.Tr>
    );
  });

  const feedingRows = data.map((d) => {
    if (!d.bottleAmount)
      return (
        <Table.Tr key={d.day}>
          <Table.Td>{d.weekDay}</Table.Td>
          <Table.Td>-</Table.Td>
          <Table.Td>-</Table.Td>
          <Table.Td>-</Table.Td>
        </Table.Tr>
      );
    return (
      <Table.Tr key={d.day}>
        <Table.Td>{d.weekDay}</Table.Td>
        <Table.Td>
          {d.leftTime} ({d.leftAmount}x)
        </Table.Td>
        <Table.Td>
          {d.rightTime} ({d.rightAmount}x)
        </Table.Td>
        <Table.Td>{d.feedingChunkAmount}x</Table.Td>
      </Table.Tr>
    );
  });

  const poopRows = data.map((d) => {
    if (!d.poopEntries?.length)
      return (
        <Table.Tr key={d.day}>
          <Table.Td>{d.weekDay}</Table.Td>
          <Table.Td>-</Table.Td>
          <Table.Td>-</Table.Td>
        </Table.Tr>
      );
    return (
      <Table.Tr key={d.day}>
        <Table.Td>{d.weekDay}</Table.Td>
        <Table.Td>{d.poopEntries?.length}</Table.Td>
        <Table.Td>
          {d.averageTimeBetweenPoops || 0} {t('statistics-page-label-hours')}
        </Table.Td>
      </Table.Tr>
    );
  });

  const sleepRows = data.map((d) => (
    <Table.Tr key={d.day}>
      <Table.Td>{d.weekDay}</Table.Td>
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
                <Text>{t('statistics-page-last-week-bottle-title')}</Text>
              </Group>

              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th className={styles.tableTextTh}>
                      {t('statistics-page-last-week-bottle-label-average')}
                    </Table.Th>
                    <Table.Th className={styles.tableTextTh}>
                      {t('statistics-page-last-week-bottle-label-total')}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className={styles.tableBody}>{bottleRows}</Table.Tbody>
              </Table>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Group wrap="nowrap" align="center">
                <ThemeIcon radius="50%" size="xl" variant="outline">
                  <IconDroplet />
                </ThemeIcon>
                <Text>{t('statistics-page-last-week-feeding-title')}</Text>
              </Group>

              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th className={styles.tableTextTh}>{t('left')}</Table.Th>
                    <Table.Th className={styles.tableTextTh}>{t('right')}</Table.Th>
                    <Table.Th className={styles.tableTextTh}>
                      {t('statistics-page-table-col-feeding-chunks')}*
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className={styles.tableBody}>{feedingRows}</Table.Tbody>
              </Table>
              <Text size="xs">{t('statistics-page-24-hours-breast-hint')}</Text>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Group wrap="nowrap" align="center">
                <ThemeIcon radius="50%" size="xl" variant="outline">
                  <IconPoo />
                </ThemeIcon>
                <Text>{t('statistics-page-last-week-poops-title')}</Text>
              </Group>

              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th className={styles.tableTextTh}>
                      {t('statistics-page-last-week-poops-amount')}
                    </Table.Th>
                    <Table.Th className={styles.tableTextTh}>
                      {t('statistics-page-last-week-poops-time-between')}
                    </Table.Th>
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
                  <IconBedFlat />
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
