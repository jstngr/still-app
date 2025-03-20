import { ActionIcon, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus, IconZzz, IconZzzOff } from '@tabler/icons-react';

import HistoryInfiniteScrollList from 'components/history-infinite-scroll-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ISleepEntry } from 'shared/types/types';
import SleepTimer from './components/sleep-timer';
import { useSleepContext } from 'service/sleep.service';
import SleepHistoryItem from './components/sleep-history-item';
import EditSleepEntryDrawer from './components/edit-sleep-entry-drawer';
import TimeAgoTimer from 'components/time-ago-timer';

export default function SleepPage() {
  const { activeSleep, sleepEntries, stopSleep, addSleepEntry, startSleep } = useSleepContext();
  const { t } = useTranslation();
  const lastEntry = sleepEntries[0];

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <Button
          styles={{
            root: {
              borderRadius: '50%',
            },
          }}
          color="primary"
          h="30vw"
          mah="8rem"
          w="30vw"
          maw="8rem"
          variant={activeSleep ? 'outline' : 'filled'}
          onClick={activeSleep ? stopSleep : startSleep}
        >
          <Stack gap="xxs" align="center">
            {activeSleep ? <IconZzzOff /> : <IconZzz />}
            <Text>
              {activeSleep ? t('sleep-page-button-label-stop') : t('sleep-page-button-label-start')}
            </Text>
          </Stack>
        </Button>

        {activeSleep ? (
          <SleepTimer />
        ) : (
          <TimeAgoTimer
            startTime={lastEntry?.stopped || 0}
            tooLongAgoLabel={t('sleep-page-time-ago-label-more-than-24-hours')}
            sinceLabel={t('sleep-page-time-ago-label')}
            hasNoPreviousEntry={!lastEntry}
            noEntryLabel={t('sleep-page-time-ago-label-no-entry')}
          />
        )}

        <Stack flex="1 0 0" w="100%" gap="xs">
          <Group justify="space-between" align="center">
            <Title order={5}>{t('sleep-page-history-title')}</Title>

            <ActionIcon variant="subtle" onClick={addSleepEntry}>
              <IconPlus stroke="1.5" />
            </ActionIcon>
          </Group>
          {sleepEntries?.length ? (
            <HistoryInfiniteScrollList<ISleepEntry>
              data={sleepEntries}
              ItemComponent={SleepHistoryItem}
              cardBaseSize={57}
            />
          ) : (
            <Stack gap="xxs" align="center" mt="xl">
              <Text size="sm" c={'dimmed'}>
                {t('empty-history-hint-1')}
              </Text>
              <Text size="sm" c={'dimmed'}>
                {t('empty-history-hint-2')}
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
      <EditSleepEntryDrawer />
    </Container>
  );
}
