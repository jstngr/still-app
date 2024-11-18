import { ActionIcon, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import BoobButton from 'components/boob-button/boob-button';
import BoobSwitchModal from 'components/boob-button/boob-switch-modal';
import EditFeedingEntryDrawer from 'components/edit-feeding-entry-drawer';
import FeedTimer from 'components/feed-timer';
import FeedingHistoryItem from 'components/feeding-history-item';
import HistoryInfiniteScrollList from 'components/history-infinite-scroll-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { IFeedingEntry } from 'shared/types/types';

export default function FeedTracker() {
  const { feedingEntries, addFeedingEntry } = useFeedingContext();
  const { t } = useTranslation();

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <Group grow gap="lg">
          <BoobButton label={t('left')} orientation="Left" />
          <BoobButton label={t('right')} orientation="Right" />
        </Group>

        <FeedTimer />

        <Stack flex="1 0 0" w="100%" gap="xs">
          <Group justify="space-between" align="center">
            <Title order={5}>{t('feeding-history-title')}</Title>
            <ActionIcon variant="subtle" onClick={addFeedingEntry}>
              <IconPlus stroke="1.5" />
            </ActionIcon>
          </Group>
          {feedingEntries?.length ? (
            <HistoryInfiniteScrollList<IFeedingEntry>
              data={feedingEntries}
              ItemComponent={FeedingHistoryItem}
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
      <BoobSwitchModal />
      <EditFeedingEntryDrawer />
    </Container>
  );
}
