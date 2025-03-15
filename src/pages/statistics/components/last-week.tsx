import React from 'react';
import {
  ScrollArea,
  Container,
  Stack,
  Table,
  Text,
  Group,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';
import { IconBabyBottle, IconBedFlat, IconDroplet, IconPoo } from '@tabler/icons-react';
import styles from './last-week.module.css';
import useLastWeek, { ILastWeekData } from '../hooks/use-last-week';

interface DataRowsProps {
  data: ILastWeekData;
  renderRow: (entry: ILastWeekData[0]) => React.ReactNode;
  emptyCells: string[];
}

interface DataCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  tableHeaders: string[];
  rows: React.ReactNode;
  additionalText?: string;
}

// Functional component for rendering rows
function DataRows({ data, renderRow, emptyCells }: DataRowsProps) {
  return (
    <>
      {data.map(
        (entry) =>
          renderRow(entry) || (
            <Table.Tr key={entry.day}>
              <Table.Td>{entry.weekDay}</Table.Td>
              {emptyCells.map((cell, index) => (
                <Table.Td key={index}>{cell}</Table.Td>
              ))}
            </Table.Tr>
          ),
      )}
    </>
  );
}

// Functional component for rendering cards
function DataCard({ icon, title, subtitle, tableHeaders, rows, additionalText }: DataCardProps) {
  const { t } = useTranslation();

  return (
    <Stack>
      <Group wrap="nowrap" align="center">
        <ThemeIcon radius="50%" size="xl" variant="outline">
          {icon}
        </ThemeIcon>
        <Stack gap="0">
          <Text>{title}</Text>
          {!!subtitle && <Text size="xs">{subtitle}</Text>}
        </Stack>
      </Group>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            {tableHeaders.map((header, index) => (
              <Table.Th key={index} className={styles.tableTextTh}>
                {header}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className={styles.tableBody}>{rows}</Table.Tbody>
      </Table>
      {additionalText && <Text size="xs">{t(additionalText)}</Text>}
    </Stack>
  );
}

function LastWeek() {
  const { feedingUnit, feedByBoob, feedByBottle, poopTrackerEnabled, sleepTrackerEnabled } =
    useSettingsContext();
  const { t } = useTranslation();
  const { data } = useLastWeek();

  const bottleRows = (
    <DataRows
      data={data}
      renderRow={(d) =>
        d.bottleAmount && (
          <Table.Tr key={d.day}>
            <Table.Td>{d.weekDay}</Table.Td>
            <Table.Td>
              {d.bottleAverageVolume} {feedingUnit} ({d.bottleAmount}x)
            </Table.Td>
            <Table.Td>
              {d.bottleTotalVolume} {feedingUnit}
            </Table.Td>
          </Table.Tr>
        )
      }
      emptyCells={['-', '-']}
    />
  );

  const feedingRows = (
    <DataRows
      data={data}
      renderRow={(d) =>
        d.bottleAmount && (
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
        )
      }
      emptyCells={['-', '-', '-']}
    />
  );

  const poopRows = (
    <DataRows
      data={data}
      renderRow={(d) =>
        d.poopEntries?.length && (
          <Table.Tr key={d.day}>
            <Table.Td>{d.weekDay}</Table.Td>
            <Table.Td>{d.poopEntries.length}</Table.Td>
            <Table.Td>{d.averageTimeBetweenPoops || '00:00'}</Table.Td>
          </Table.Tr>
        )
      }
      emptyCells={['-', '-']}
    />
  );

  const sleepRows = (
    <DataRows
      data={data}
      renderRow={(d) =>
        d.sleepEntries?.length && (
          <Table.Tr key={d.day}>
            <Table.Td>{d.weekDay}</Table.Td>
            <Table.Td>{d.sleepEntries.length || 0}</Table.Td>
            <Table.Td>{d.averageDurationOfSleeps}</Table.Td>
            <Table.Td>{d.totalDurationOfSleeps}</Table.Td>
          </Table.Tr>
        )
      }
      emptyCells={['-', '-', '-']}
    />
  );

  return (
    <ScrollArea h="100%">
      <Container fluid w="100%" py="8px">
        <Stack gap="xl">
          {feedByBottle && (
            <>
              <DataCard
                icon={<IconBabyBottle />}
                title={t('statistics-page-last-week-bottle-title')}
                tableHeaders={[
                  '',
                  t('statistics-page-last-week-bottle-label-average'),
                  t('statistics-page-last-week-bottle-label-total'),
                ]}
                rows={bottleRows}
              />
              {(feedByBoob || poopTrackerEnabled || sleepTrackerEnabled) && <Divider />}
            </>
          )}
          {feedByBoob && (
            <>
              <DataCard
                icon={<IconDroplet />}
                title={t('statistics-page-last-week-feeding-title')}
                subtitle={t('statistics-page-last-week-feeding-subtitle')}
                tableHeaders={[
                  '',
                  t('left'),
                  t('right'),
                  t('statistics-page-table-col-feeding-chunks') + '*',
                ]}
                rows={feedingRows}
                additionalText="statistics-page-24-hours-breast-hint"
              />
              {(poopTrackerEnabled || sleepTrackerEnabled) && <Divider />}
            </>
          )}
          {poopTrackerEnabled && (
            <>
              <DataCard
                icon={<IconPoo />}
                title={t('statistics-page-last-week-poops-title')}
                subtitle={t('statistics-page-last-week-poops-subtitle')}
                tableHeaders={[
                  '',
                  t('statistics-page-last-week-poops-amount'),
                  t('statistics-page-last-week-poops-time-between'),
                ]}
                rows={poopRows}
              />
              {sleepTrackerEnabled && <Divider />}
            </>
          )}
          {sleepTrackerEnabled && (
            <DataCard
              icon={<IconBedFlat />}
              title={t('statistics-page-last-week-sleep-title')}
              subtitle={t('statistics-page-last-week-sleep-subtitle')}
              tableHeaders={[
                '',
                t('statistics-page-last-week-sleep-label-sessions'),
                t('statistics-page-last-week-sleep-label-average'),
                t('statistics-page-last-week-sleep-label-total'),
              ]}
              rows={sleepRows}
            />
          )}
        </Stack>
      </Container>
    </ScrollArea>
  );
}

export default LastWeek;
