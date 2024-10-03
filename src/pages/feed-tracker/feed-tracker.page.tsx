import { Container, Group, Stack, Text, Title } from '@mantine/core';
import BoobButton from 'components/boob-button/boob-button';
import BoobSwitchModal from 'components/boob-button/boob-switch-modal';
import FeedTimer from 'components/feed-timer';
import HistoryInfiniteScrollList from 'components/history-infinite-scroll-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';

export default function FeedTracker() {
  const { feedingEntries } = useFeedingContext();
  const { t } = useTranslation();

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <Group grow gap="lg">
          <BoobButton label={t('left')} orientation="Left" />
          <BoobButton label={t('right')} orientation="Right" />
        </Group>

        <FeedTimer />

        {/* <Stack w="100%" gap="xs">
          <Title order={5}>At a glance</Title>
          <ScrollArea w={'calc(100% + 10px)'} classNames={scrollStyles}>
            <Group wrap="nowrap" py="xxs" px="5px">
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
              <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
            </Group>
          </ScrollArea>
        </Stack> */}

        <Stack flex="1 0 0" w="100%" gap="xs">
          <Title order={5}>{t('feeding-history-title')}</Title>
          {feedingEntries?.length ? (
            <HistoryInfiniteScrollList data={feedingEntries} ItemComponent={<></>} />
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
    </Container>
  );
}
