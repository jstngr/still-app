import { ActionIcon, Box, Card, Group, Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import formatDateLocaleFromTimestamp from 'shared/helpers/format-date-locale-from-timestamp';
import { BaseEntry, BaseHistoryCardProps } from './types/history-item.types';
import styles from './styles/history-card.module.css';

export default function BaseHistoryCard<T extends BaseEntry>({
  entry,
  showDateLabel,
  isActive,
  icon,
  onEdit,
  children,
}: BaseHistoryCardProps<T>) {
  const { t, i18n } = useTranslation();

  return (
    <>
      {showDateLabel && (
        <Box bg="background.1" p="4px">
          <Text c="dimmed" size="12px" key={`label_${entry.id}`}>
            {formatDateLocaleFromTimestamp(entry.created, t, i18n)}
          </Text>
        </Box>
      )}
      <Card
        py="xs"
        px="xs"
        key={`card_${entry.id}`}
        bg="background.0"
        className={`${styles.card} ${showDateLabel ? '' : styles.dashedBorderTop}`}
      >
        {isActive && <div className={styles.activeCardIndicator} />}
        <Group align="center" justify="space-between" gap="0">
          {icon}
          {children}
          {onEdit && entry.id && (
            <ActionIcon
              disabled={isActive}
              variant="subtle"
              size="md"
              onClick={() => onEdit(entry.id!)}
            >
              <IconPencil stroke="1" size="20" />
            </ActionIcon>
          )}
        </Group>
      </Card>
    </>
  );
}
