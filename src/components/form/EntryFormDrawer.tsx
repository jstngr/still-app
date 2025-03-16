import { ActionIcon, Box, Button, Drawer, Flex, Group, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClockPlay, IconClockStop, IconTrash } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryForm, EntryBase } from 'shared/hooks/useEntryForm';

interface EntryFormDrawerProps<T extends EntryBase> {
  entry: T | undefined;
  onSave: (entry: T) => void;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  title: string;
  opened: boolean;
  children?: (
    formData: T,
    updateForm: (key: keyof T, value: T[keyof T]) => void,
  ) => React.ReactNode;
  showStopTime?: boolean;
  fromLabel?: string;
  toLabel?: string;
  saveLabel?: string;
}

export default function EntryFormDrawer<T extends EntryBase>({
  entry,
  onSave,
  onClose,
  onDelete,
  title,
  opened,
  children,
  showStopTime = true,
  fromLabel,
  toLabel,
  saveLabel,
}: EntryFormDrawerProps<T>) {
  const { t } = useTranslation();
  const {
    formData,
    updateForm,
    updateTimeField,
    getTimeValue,
    handleSave,
    handleDelete,
    handleClose,
  } = useEntryForm({
    entry,
    onSave,
    onClose,
    onDelete,
  });

  if (!formData) return null;

  // Determine which field to use for start time
  const startField = formData.started !== undefined ? 'started' : 'created';
  const startTime = formData[startField] || Date.now();
  const stopTime = formData.stopped || Date.now();

  return (
    <Drawer
      position="bottom"
      opened={opened}
      onClose={handleClose}
      title={title}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          flexGrow: '1',
          display: 'flex',
          justifyContent: 'center',
        },
      }}
    >
      <Flex maw="500px" direction="column" flex="1">
        <Stack>
          <Group grow align="center">
            <TimeInput
              leftSection={<IconClockPlay stroke="1" />}
              label={fromLabel || t('feeding-entry-drawer-input-label-from')}
              value={getTimeValue(startTime)}
              onChange={(event) =>
                updateTimeField(startField as keyof T, event.currentTarget.value, startTime)
              }
              maxTime={showStopTime && stopTime ? getTimeValue(stopTime) : undefined}
            />
            {showStopTime && (
              <TimeInput
                leftSection={<IconClockStop stroke="1" />}
                label={toLabel || t('feeding-entry-drawer-input-label-to')}
                value={getTimeValue(stopTime)}
                onChange={(event) =>
                  updateTimeField('stopped' as keyof T, event.currentTarget.value, stopTime)
                }
                minTime={getTimeValue(startTime)}
              />
            )}
          </Group>

          {children?.(formData, updateForm)}
        </Stack>
        <Flex flex="1" align="end" mb="1rem">
          <Group flex="1" align="stretch" justify="space-between">
            {onDelete && (
              <Box>
                <ActionIcon variant="outline" h="2.25rem" w="2.25rem" onClick={handleDelete}>
                  <IconTrash stroke="1.5" size="18px" />
                </ActionIcon>
              </Box>
            )}
            <Button onClick={handleSave}>
              {saveLabel || t('feeding-entry-drawer-button-label-save')}
            </Button>
          </Group>
        </Flex>
      </Flex>
    </Drawer>
  );
}
