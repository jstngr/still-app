import { ActionIcon, Box, Button, Drawer, Flex, Group, Stack } from '@mantine/core';
import { TimeInput, DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconClockPlay, IconClockStop, IconTrash } from '@tabler/icons-react';
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
    updateDateField,
    getDateValue,
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
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        },
      }}
    >
      <Flex maw="500px" direction="column" flex="1">
        <Stack>
          <Group grow align="flex-start">
            <Stack gap="xs">
              <TimeInput
                leftSection={<IconClockPlay stroke="1" />}
                label={fromLabel || t('feeding-entry-drawer-input-label-from')}
                value={getTimeValue(startTime)}
                onChange={(event) =>
                  updateTimeField(startField as keyof T, event.currentTarget.value, startTime)
                }
                maw="50vw"
                maxTime={showStopTime ? getTimeValue(stopTime) : undefined}
              />
              <DatePickerInput
                leftSection={<IconCalendar stroke="1" />}
                value={getDateValue(startTime)}
                maw="50vw"
                onChange={(date) => updateDateField(startField as keyof T, date, startTime)}
                maxDate={showStopTime ? getDateValue(stopTime) : undefined}
              />
            </Stack>
            {showStopTime && (
              <Stack gap="xs">
                <TimeInput
                  leftSection={<IconClockStop stroke="1" />}
                  label={toLabel || t('feeding-entry-drawer-input-label-to')}
                  value={getTimeValue(stopTime)}
                  onChange={(event) =>
                    updateTimeField('stopped' as keyof T, event.currentTarget.value, stopTime)
                  }
                  minTime={getTimeValue(startTime)}
                  maw="50vw"
                />
                <DatePickerInput
                  leftSection={<IconCalendar stroke="1" />}
                  value={getDateValue(stopTime)}
                  onChange={(date) => updateDateField('stopped' as keyof T, date, stopTime)}
                  minDate={getDateValue(startTime)}
                  maw="50vw"
                />
              </Stack>
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
