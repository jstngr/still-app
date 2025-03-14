import { ActionIcon, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import BoobButton from 'pages/feed-tracker/components/boob-button/boob-button';
import BoobSwitchModal from 'pages/feed-tracker/components/boob-button/boob-switch-modal';
import BottleButton from 'pages/feed-tracker/components/bottle-button';
import EditFeedingEntryDrawer from 'pages/feed-tracker/components/edit-feeding-entry-drawer';
import FeedTimer from 'pages/feed-tracker/components/feed-timer';
import FeedingHistoryItem from 'pages/feed-tracker/components/feeding-history-item';
import HistoryInfiniteScrollList from 'components/history-infinite-scroll-list';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { useSettingsContext } from 'service/settings.service';
import { IFeedingEntry } from 'shared/types/types';
import EditBottleFeedingEntryDrawer from './components/edit-bottle-feeding-entry-drawer';
import TimeAgoTimer from '../../components/time-ago-timer';
import FeedingEntry from 'classes/feeding-entry.class';
import { useAppRefreshContext } from 'service/app-refresh.service';

export default function FeedTracker() {
  const { feedingEntries, addFeedingEntry, activeFeeding } = useFeedingContext();
  const { feedByBoob, feedByBottle } = useSettingsContext();
  const { t } = useTranslation();

  const lastEntry = feedingEntries[0];
  const timeAgo = useMemo(() => {
    if (!lastEntry) return 0;
    return new FeedingEntry(lastEntry).getTimeAgo();
  }, [lastEntry]);

  const { toggleState } = useAppRefreshContext();
  if (toggleState) {
    return <div />;
  }

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <Group grow gap={feedByBottle ? 'md' : 'xl'}>
          {feedByBoob && <BoobButton label={t('left')} orientation="Left" />}
          {feedByBottle && <BottleButton />}
          {feedByBoob && <BoobButton label={t('right')} orientation="Right" />}
        </Group>
        {activeFeeding && feedByBoob && <FeedTimer />}
        {!activeFeeding && (
          <TimeAgoTimer
            timeAgo={timeAgo}
            tooLongAgoLabel={t('time-ago-label-more-than-24-hours')}
            sinceLabel={t('time-ago-label')}
            hasNoPreviousEntry={!lastEntry}
            noEntryLabel={t('feed-tracker-time-ago-label-no-entry')}
          />
        )}
        <Stack flex="1 0 0" w="100%" gap="xs">
          <Group justify="space-between" align="center">
            <Title order={5}>{t('feeding-history-title')}</Title>
            {feedByBoob && (
              <ActionIcon variant="subtle" onClick={addFeedingEntry}>
                <IconPlus stroke="1.5" />
              </ActionIcon>
            )}
          </Group>
          {feedingEntries?.length ? (
            <HistoryInfiniteScrollList<IFeedingEntry>
              data={feedingEntries}
              ItemComponent={FeedingHistoryItem}
              cardBaseSize={60}
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
      <BoobSwitchModal />
      <EditFeedingEntryDrawer />
      <EditBottleFeedingEntryDrawer />
    </Container>
  );
}
