import {
  ActionIcon,
  Box,
  Button,
  Chip,
  Drawer,
  Flex,
  Group,
  InputLabel,
  Stack,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClockPause, IconClockPlay, IconClockStop, IconTrash } from '@tabler/icons-react';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import formatMillisecondsToMinutesSeconds from 'shared/helpers/format-milliseconds-to-minutes-seconds';
import formatMinutesSecondsToMilliseconds from 'shared/helpers/format-minutes-seconds-to-milliseconds';
import { IFeedingEntry } from 'shared/types/types';

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

function EditFeedingEntryDrawer() {
  const { t } = useTranslation();
  const { editFeedingEntryDrawer, feedingEntries, deleteFeeding, updateFeedingEntry } =
    useFeedingContext();
  const { feedingEntryDrawerOpened, closeFeedingEntryDrawer, feedingEntryDrawerEntryId } =
    editFeedingEntryDrawer;

  const entry = useMemo(
    () => feedingEntries.find(({ id }) => id === feedingEntryDrawerEntryId),
    [feedingEntries, feedingEntryDrawerEntryId],
  );

  const [formData, setformData] = useState(entry);
  const updateForm = (key: keyof IFeedingEntry, value: IFeedingEntry[keyof IFeedingEntry]) => {
    setformData(
      (current) =>
        ({
          ...current,
          [key]: value,
        }) as IFeedingEntry,
    );
  };

  useEffect(() => {
    setformData(entry);
  }, [entry?.id]);

  const onSave = () => {
    if (formData) {
      const entryInstance = new FeedingEntry(formData);
      updateFeedingEntry(entryInstance);
    }
    closeFeedingEntryDrawer();
  };
  const onDelete = async () => {
    if (entry?.id) {
      await deleteFeeding(entry.id);
    }
    closeFeedingEntryDrawer();
  };

  const maxPause = useMemo(
    () => formatMillisecondsToMinutesSeconds((formData?.stopped || 0) - (formData?.created || 0)),
    [formData?.created, formData?.stopped],
  );

  const removePause = () => {
    updateForm('pauseDuration', 0);
  };

  useEffect(() => {
    if (formData) {
      const entryInstance = new FeedingEntry(formData);
      const pauseDuration = entryInstance.getPauseDuration();
      const maxDuration = (formData.stopped || 0) - (formData.created || 0);

      if (pauseDuration > maxDuration) {
        updateForm('pauseDuration', maxDuration);
      }
    }
  }, [formData?.created, formData?.stopped]);

  return (
    <Drawer
      position="bottom"
      opened={feedingEntryDrawerOpened}
      onClose={closeFeedingEntryDrawer}
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
          <Group align="end">
            <TimeInput
              flex="1"
              leftSection={<IconClockPause stroke="1" />}
              label={t('feeding-entry-drawer-input-label-pause')}
              value={formatMillisecondsToMinutesSeconds(formData?.pauseDuration || 0)}
              onChange={(event) =>
                updateForm(
                  'pauseDuration',
                  formatMinutesSecondsToMilliseconds(event.currentTarget.value),
                )
              }
              maxTime={maxPause}
            />
            <ActionIcon
              bd="1px solid var(--mantine-color-gray-4)"
              c="black"
              variant="white"
              h="2.25rem"
              w="2.25rem"
              onClick={removePause}
            >
              <IconTrash stroke="1.5" size="18px" />
            </ActionIcon>
          </Group>
          <Stack gap="2px">
            <InputLabel>{t('feeding-entry-drawer-chip-label-feeded-with')}</InputLabel>
            <Group>
              <Chip.Group
                value={formData?.type}
                onChange={(value) => updateForm('type', value as 'Left' | 'Right')}
              >
                <Chip value="Left" variant="outline">
                  {t('feeding-entry-drawer-chip-left-boob')}
                </Chip>
                <Chip value="Right" variant="outline">
                  {t('feeding-entry-drawer-chip-right-boob')}
                </Chip>
              </Chip.Group>
            </Group>
          </Stack>
        </Stack>
        <Flex flex="1" align="end">
          <Group flex="1" align="stretch" justify="space-between">
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

export default EditFeedingEntryDrawer;
