import { NumberInput, Stack } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import EntryFormDrawer from 'components/form/EntryFormDrawer';
import { IFeedingEntry } from 'shared/types/types';
import { useSettingsContext } from 'service/settings.service';

function EditBottleFeedingEntryDrawer() {
  const { t } = useTranslation();
  const { editBottleFeedingEntryDrawer, feedingEntries, deleteFeeding, updateFeedingEntry } =
    useFeedingContext();
  const {
    bottleFeedingEntryDrawerOpened,
    closeBottleFeedingEntryDrawer,
    bottleFeedingEntryDrawerEntryId,
  } = editBottleFeedingEntryDrawer;
  const { feedingUnit } = useSettingsContext();

  const entry = useMemo(
    () => feedingEntries.find(({ id }) => id === bottleFeedingEntryDrawerEntryId),
    [feedingEntries, bottleFeedingEntryDrawerEntryId],
  );

  const renderContent = (
    formData: IFeedingEntry,
    updateForm: (key: keyof IFeedingEntry, value: IFeedingEntry[keyof IFeedingEntry]) => void,
  ) => (
    <Stack>
      <NumberInput
        label={t('bottle-feeding-entry-drawer-input-label-volume', { suffix: feedingUnit })}
        value={formData.volume}
        onChange={(value) =>
          updateForm('volume', typeof value === 'string' ? parseInt(value, 10) : value)
        }
        min={0}
        max={1000}
        step={5}
      />
    </Stack>
  );

  const handleDelete = async (id: string) => {
    await deleteFeeding(parseInt(id, 10));
  };

  return (
    <EntryFormDrawer
      entry={entry}
      onSave={(data) => updateFeedingEntry(new FeedingEntry(data))}
      onClose={closeBottleFeedingEntryDrawer}
      onDelete={handleDelete}
      title={t('bottle-feeding-entry-drawer-title')}
      opened={bottleFeedingEntryDrawerOpened}
      fromLabel={t('bottle-feeding-entry-drawer-input-label-created')}
      saveLabel={t('bottle-feeding-entry-drawer-button-label-save')}
      showStopTime={false}
    >
      {renderContent}
    </EntryFormDrawer>
  );
}

export default EditBottleFeedingEntryDrawer;
