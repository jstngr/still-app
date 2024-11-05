import { ActionIcon, Badge, Card, Flex, Group, Stack, Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { usePoopContext } from 'service/poop.service';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IPoopEntry } from 'shared/types/types';

export default function PoopHistoryItem({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: IPoopEntry[];
}): React.ReactNode {
  const entry = data[index];
  const { editPoopEntryDrawer } = usePoopContext();

  const showDateLabel = useMemo(() => {
    const prevEntry = data[index - 1];
    return (
      !prevEntry ||
      formatDateFromTimestamp(prevEntry.created) !== formatDateFromTimestamp(entry.created)
    );
  }, [data]);

  const onClickEdit = () => {
    if (entry?.id !== undefined) {
      editPoopEntryDrawer.openPoopEntryDrawer(entry.id);
    }
  };

  return (
    <Flex
      key={`wrapper_${data[index].id}`}
      align="center"
      style={style}
      py={'4px'}
      px="4px"
      flex="1 0 0"
    >
      <Stack gap="8px" flex="1 0 0">
        <>
          {showDateLabel && (
            <Text c="dimmed" size="12px" key={`label_${entry.id}`}>
              {formatDateLocaleFromTimestamp(entry.created)}
            </Text>
          )}
          <Card key={`card_${entry.id}`} shadow="xs">
            <Group justify="space-between" gap="xs">
              <Group align="center" h="100%">
                <Badge variant="outline" size="lg" className={monoStyles.monoFont}>
                  L
                </Badge>
                <Stack gap={'xxs'} align="start">
                  <Group gap={'xs'} justify="end" grow>
                    <Text size="12px" c="dimmed">
                      {t('history-card-label-from')}
                    </Text>
                    <Text size="12px" className={monoStyles.monoFont}>
                      {11}
                    </Text>
                  </Group>
                  <Group gap={'xs'} justify="end" w="100%" grow>
                    <Text size="12px" c="dimmed">
                      {t('history-card-label-to')}
                    </Text>
                    <Text size="12px" className={monoStyles.monoFont}>
                      {11}
                    </Text>
                  </Group>
                </Stack>
              </Group>

              <ActionIcon variant="subtle" size="md" onClick={onClickEdit}>
                <IconPencil stroke="1" size="20" />
              </ActionIcon>
            </Group>
          </Card>
        </>
      </Stack>
    </Flex>
  );
}
