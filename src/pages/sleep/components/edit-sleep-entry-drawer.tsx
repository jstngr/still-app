import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSleepContext } from 'service/sleep.service';
import EntryFormDrawer from 'components/form/EntryFormDrawer';
import SleepEntry from 'classes/sleep-entry.class';

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

  const handleDelete = async (id: string) => {
    await deleteSleepEntry(parseInt(id, 10));
  };

  return (
    <EntryFormDrawer
      entry={entry}
      onSave={(data) => updateSleepEntry(new SleepEntry(data))}
      onClose={closeSleepEntryDrawer}
      onDelete={handleDelete}
      title={t('sleep-entry-drawer-title')}
      opened={sleepEntryDrawerOpened}
      fromLabel={t('sleep-entry-drawer-input-label-from')}
      toLabel={t('sleep-entry-drawer-input-label-to')}
      saveLabel={t('sleep-entry-drawer-button-label-save')}
    />
  );
}

export default EditSleepEntryDrawer;
