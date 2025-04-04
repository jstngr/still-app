import { Container, Stack, Text, Title } from '@mantine/core';
import BigAddButton from 'components/big-add-button';
import EditPoopEntryDrawer from 'components/edit-poop-entry-drawer';
import HistoryInfiniteScrollList from 'components/history-infinite-scroll-list';
import PoopHistoryItem from 'components/poop-history-item';
import { t } from 'i18next';
import React from 'react';
import { usePoopContext } from 'service/poop.service';
import { IPoopEntry } from 'shared/types/types';

export default function PoopPage() {
  const { poopEntries, addPoopEntry } = usePoopContext();

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="center" gap="xl" h="100%" w="100%">
        <BigAddButton onClick={addPoopEntry} label={t('poop-page-button-label-add')} />
        <Stack flex="1 0 0" w="100%" gap="xs">
          <Title order={5}>{t('poop-page-title-history')}</Title>

          {poopEntries?.length ? (
            <HistoryInfiniteScrollList<IPoopEntry>
              data={poopEntries}
              ItemComponent={PoopHistoryItem}
              cardBaseSize={49}
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
      <EditPoopEntryDrawer />
    </Container>
  );
}
