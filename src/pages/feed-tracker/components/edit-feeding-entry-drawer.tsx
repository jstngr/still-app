import { Chip, Group, InputLabel, Stack } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import EntryFormDrawer from 'components/form/EntryFormDrawer';
import { IFeedingEntry } from 'shared/types/types';

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

  const renderContent = (
    formData: IFeedingEntry,
    updateForm: (key: keyof IFeedingEntry, value: IFeedingEntry[keyof IFeedingEntry]) => void,
  ) => (
    <Stack gap="2px">
      <InputLabel>{t('feeding-entry-drawer-chip-label-feeded-with')}</InputLabel>
      <Chip.Group
        value={formData.type}
        onChange={(value) => updateForm('type', value as 'Left' | 'Right')}
      >
        <Group>
          <Chip value="Left" variant="outline">
            {t('feeding-entry-drawer-chip-left-boob')}
          </Chip>
          <Chip value="Right" variant="outline">
            {t('feeding-entry-drawer-chip-right-boob')}
          </Chip>
        </Group>
      </Chip.Group>
    </Stack>
  );

  const handleDelete = async (id: string) => {
    await deleteFeeding(parseInt(id, 10));
  };

  return (
    <EntryFormDrawer
      entry={entry}
      onSave={(data) => updateFeedingEntry(new FeedingEntry(data))}
      onClose={closeFeedingEntryDrawer}
      onDelete={handleDelete}
      title={t('feeding-entry-drawer-title')}
      opened={feedingEntryDrawerOpened}
      fromLabel={t('feeding-entry-drawer-input-label-from')}
      toLabel={t('feeding-entry-drawer-input-label-to')}
      saveLabel={t('feeding-entry-drawer-button-label-save')}
    >
      {renderContent}
    </EntryFormDrawer>
  );
}

export default EditFeedingEntryDrawer;
