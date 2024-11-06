import { ActionIcon, Badge, Card, Flex, Group, Stack, Text } from '@mantine/core';
import { IconPencil, IconPoo } from '@tabler/icons-react';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { usePoopContext } from 'service/poop.service';
import formatDateFromTimestamp from 'shared/helpers/format-date-from-timestamp';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
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
    <Flex key={`wrapper_${data[index].id}`} align="center" style={style} p="4px" flex="1 0 0">
      <Stack gap="8px" flex="1 0 0">
        {showDateLabel && (
          <Text c="dimmed" size="12px" key={`label_${entry.id}`}>
            {formatDateLocaleFromTimestamp(entry.created)}
          </Text>
        )}
        <Card key={`card_${entry.id}`} shadow="xs" py="xs">
          <Group justify="space-between" gap="xs">
            <ActionIcon variant="outline" size="sm" onClick={onClickEdit}>
              <IconPoo stroke="1" size="20" />
            </ActionIcon>

            <Group gap="xs" grow>
              <Group gap="xxs">
                <Text size="12px" c="dimmed">
                  {t('poop-history-card-label-at')}
                </Text>
                <Text size="12px" className={monoStyles.monoFont}>
                  {formatTimeFromTimestamp(entry.created)}
                </Text>
              </Group>
            </Group>

            <ActionIcon variant="subtle" size="md" onClick={onClickEdit}>
              <IconPencil stroke="1" size="20" />
            </ActionIcon>
          </Group>
        </Card>
      </Stack>
    </Flex>
  );
}
