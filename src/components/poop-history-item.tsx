import { Badge, Flex, Group, Text } from '@mantine/core';
import { IconPoo } from '@tabler/icons-react';
import React from 'react';
import { Trans } from 'react-i18next';
import { usePoopContext } from 'service/poop.service';
import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IPoopEntry } from 'shared/types/types';
import BaseHistoryItem from './history/BaseHistoryItem';

export default function PoopHistoryItem({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: IPoopEntry[];
}): React.ReactNode {
  const { editPoopEntryDrawer } = usePoopContext();

  const handleEdit = (id: number) => {
    editPoopEntryDrawer.openPoopEntryDrawer(id);
  };

  return (
    <BaseHistoryItem
      index={index}
      style={style}
      data={data}
      icon={
        <Badge
          w="2.5rem"
          variant="outline"
          color="primary"
          size="lg"
          className={monoStyles.monoFont}
        >
          <Flex>
            <IconPoo size={14} stroke={2} />
          </Flex>
        </Badge>
      }
      onEdit={handleEdit}
      renderContent={(entry) => (
        <Group gap="xs" grow>
          <Group gap="xxs">
            <Text size="12px" c="dimmed">
              <Trans
                i18nKey="poop-history-card-label-at"
                values={{ value: formatTimeFromTimestamp(entry.created) }}
                components={{
                  Big: <Text size="12px" className={monoStyles.monoFont} component="span" />,
                }}
              />
            </Text>
          </Group>
        </Group>
      )}
    />
  );
}
