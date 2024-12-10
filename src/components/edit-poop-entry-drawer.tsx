import { ActionIcon, Box, Button, Drawer, Flex, Group } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClockPlay, IconTrash } from '@tabler/icons-react';
import PoopEntry from 'classes/poop-entry.class';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePoopContext } from 'service/poop.service';
import { IPoopEntry } from 'shared/types/types';

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

function EditPoopEntryDrawer() {
  const { t } = useTranslation();
  const { editPoopEntryDrawer, poopEntries, deletePoop, updatePoopEntry } = usePoopContext();
  const { poopEntryDrawerOpened, closePoopEntryDrawer, poopEntryDrawerEntryId } =
    editPoopEntryDrawer;

  const entry = useMemo(
    () => poopEntries.find(({ id }) => id === poopEntryDrawerEntryId),
    [poopEntries, poopEntryDrawerEntryId],
  );

  const [formData, setformData] = useState(entry);
  const updateForm = (key: keyof IPoopEntry, value: IPoopEntry[keyof IPoopEntry]) => {
    setformData(
      (current) =>
        ({
          ...current,
          [key]: value,
        }) as IPoopEntry,
    );
  };

  useEffect(() => {
    setformData(entry);
  }, [entry?.id]);

  const onSave = () => {
    if (formData) {
      const entryInstance = new PoopEntry(formData);
      updatePoopEntry(entryInstance);
    }
    closePoopEntryDrawer();
  };
  const onDelete = async () => {
    if (entry?.id) {
      await deletePoop(entry.id);
    }
    closePoopEntryDrawer();
  };

  return (
    <Drawer
      position="bottom"
      opened={poopEntryDrawerOpened}
      onClose={closePoopEntryDrawer}
      title={t('poop-entry-drawer-title-edit')}
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
        <TimeInput
          leftSection={<IconClockPlay stroke="1" />}
          label={t('poop-entry-drawer-input-label-at')}
          value={timeStampToTime(formData?.created || 0)}
          onChange={(event) =>
            updateForm(
              'created',
              timeToTimeStamp(formData?.created || 0, event.currentTarget.value),
            )
          }
          maxTime={timeStampToTime(new Date().getTime() || 0)}
        />

        <Flex flex="1" align="end">
          <Group flex="1" align="stretch" justify="space-between">
            <Box>
              <ActionIcon variant="outline" h="2.25rem" w="2.25rem" onClick={onDelete}>
                <IconTrash stroke="1.5" size="18px" />
              </ActionIcon>
            </Box>
            <Button onClick={onSave}>{t('poop-entry-drawer-button-label-save')}</Button>
          </Group>
        </Flex>
      </Flex>
    </Drawer>
  );
}

export default EditPoopEntryDrawer;
