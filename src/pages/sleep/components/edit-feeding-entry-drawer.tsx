import { ActionIcon, Box, Button, Drawer, Flex, Group, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClockPlay, IconClockStop, IconTrash } from '@tabler/icons-react';
import SleepEntry from 'classes/sleep-entry.class';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSleepContext } from 'service/sleep.service';
import { ISleepEntry } from 'shared/types/types';

function timeToTimeStamp(original: number, time: string) {
  const hours = parseInt(time.split(':')[0], 10);
  const minutes = parseInt(time.split(':')[1], 10);
  const date = new Date(original);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.getTime();
}

function timeStampToTime(original: number) {
  const date = new Date(original);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function EditSleepEntryDrawer() {
  const { t } = useTranslation();
  const { editSleepEntryDrawer, sleepEntries, deleteSleepEntry, updateSleepEntry } =
    useSleepContext();
  const { sleepEntryDrawerOpened, closeSleepEntryDrawer, sleepEntryDrawerEntryId } =
    editSleepEntryDrawer;

  const entry = useMemo(
    () => sleepEntries.find(({ id }) => id === sleepEntryDrawerEntryId),
    [sleepEntries, sleepEntryDrawerEntryId],
  );

  const [formData, setformData] = useState(entry);
  const updateForm = (key: keyof ISleepEntry, value: ISleepEntry[keyof ISleepEntry]) => {
    setformData(
      (current) =>
        ({
          ...current,
          [key]: value,
        }) as ISleepEntry,
    );
  };

  useEffect(() => {
    setformData(entry);
  }, [entry?.id]);

  const onSave = () => {
    if (formData) {
      const entryInstance = new SleepEntry(formData);
      updateSleepEntry(entryInstance);
    }
    closeSleepEntryDrawer();
  };
  const onDelete = async () => {
    if (entry?.id) {
      await deleteSleepEntry(entry.id);
    }
    closeSleepEntryDrawer();
  };

  return (
    <Drawer
      position="bottom"
      opened={sleepEntryDrawerOpened}
      onClose={closeSleepEntryDrawer}
      title={t('feeding-entry-drawer-title')}
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
          <Group grow align="center">
            <TimeInput
              leftSection={<IconClockPlay stroke="1" />}
              label={t('feeding-entry-drawer-input-label-from')}
              value={timeStampToTime(formData?.created || 0)}
              onChange={(event) =>
                updateForm(
                  'created',
                  timeToTimeStamp(formData?.created || 0, event.currentTarget.value),
                )
              }
              maxTime={timeStampToTime(formData?.stopped || 0)}
            />
            <TimeInput
              leftSection={<IconClockStop stroke="1" />}
              label={t('feeding-entry-drawer-input-label-to')}
              value={timeStampToTime(formData?.stopped || 0)}
              onChange={(event) =>
                updateForm(
                  'stopped',
                  timeToTimeStamp(formData?.stopped || 0, event.currentTarget.value),
                )
              }
              minTime={timeStampToTime(formData?.created || 0)}
            />
          </Group>
        </Stack>
        <Flex flex="1" align="end">
          <Group flex="1" grow align="stretch">
            <Box>
              <ActionIcon variant="outline" h="2.25rem" w="2.25rem" onClick={onDelete}>
                <IconTrash stroke="1.5" size="18px" />
              </ActionIcon>
            </Box>
            <Button onClick={onSave}>{t('feeding-entry-drawer-button-label-save')}</Button>
          </Group>
        </Flex>
      </Flex>
    </Drawer>
  );
}

export default EditSleepEntryDrawer;
