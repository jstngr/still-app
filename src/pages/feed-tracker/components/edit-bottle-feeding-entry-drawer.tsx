import {
  ActionIcon,
  Box,
  Button,
  Chip,
  Drawer,
  Flex,
  Group,
  InputLabel,
  NumberInput,
  Stack,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import {
  IconClockPause,
  IconClockPlay,
  IconClockStop,
  IconDropletHalfFilled,
  IconTrash,
} from '@tabler/icons-react';
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

function EditBottleFeedingEntryDrawer() {
  const { t } = useTranslation();
  const { editBottleFeedingEntryDrawer, feedingEntries, deleteFeeding, updateFeedingEntry } =
    useFeedingContext();
  const {
    bottleFeedingEntryDrawerOpened,
    closeBottleFeedingEntryDrawer,
    bottleFeedingEntryDrawerEntryId,
  } = editBottleFeedingEntryDrawer;

  const entry = useMemo(
    () => feedingEntries.find(({ id }) => id === bottleFeedingEntryDrawerEntryId),
    [feedingEntries, bottleFeedingEntryDrawerEntryId],
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
    closeBottleFeedingEntryDrawer();
  };
  const onDelete = async () => {
    if (entry?.id) {
      await deleteFeeding(entry.id);
    }
    closeBottleFeedingEntryDrawer();
  };

  const valueToNumber = (value: string | number) => {
    if (!value) return 0;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  };

  return (
    <Drawer
      position="bottom"
      opened={bottleFeedingEntryDrawerOpened}
      onClose={closeBottleFeedingEntryDrawer}
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
        <Group align="center" grow>
          <TimeInput
            leftSection={<IconClockPlay stroke="1" />}
            label={t('bottle-feeding-entry-drawer-input-label-created')}
            value={timeStampToTime(formData?.created || 0)}
            onChange={(event) =>
              updateForm(
                'created',
                timeToTimeStamp(formData?.created || 0, event.currentTarget.value),
              )
            }
            maxTime={timeStampToTime(formData?.stopped || 0)}
          />
          <NumberInput
            leftSection={<IconDropletHalfFilled stroke="1" />}
            label={t('bottle-feeding-entry-drawer-input-label-volume', { suffix: 'ml' })}
            value={formData?.volume}
            onChange={(value) => updateForm('volume', valueToNumber(value))}
            suffix=" ml"
            defaultValue={100} // need to set the default on creation of entry
            allowNegative={false}
            allowDecimal={false}
            hideControls
            max={1000}
          />
        </Group>
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

export default EditBottleFeedingEntryDrawer;
