import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePoopContext } from 'service/poop.service';
import EntryFormDrawer from 'components/form/EntryFormDrawer';
import PoopEntry from 'classes/poop-entry.class';

function EditPoopEntryDrawer() {
  const { t } = useTranslation();
  const { editPoopEntryDrawer, poopEntries, deletePoop, updatePoopEntry } = usePoopContext();
  const { poopEntryDrawerOpened, closePoopEntryDrawer, poopEntryDrawerEntryId } =
    editPoopEntryDrawer;

  const entry = useMemo(
    () => poopEntries.find(({ id }) => id === poopEntryDrawerEntryId),
    [poopEntries, poopEntryDrawerEntryId],
  );

  const handleDelete = async (id: string) => {
    await deletePoop(parseInt(id, 10));
  };

  return (
    <EntryFormDrawer
      entry={entry}
      onSave={(data) => updatePoopEntry(new PoopEntry(data))}
      onClose={closePoopEntryDrawer}
      onDelete={handleDelete}
      title={t('poop-entry-drawer-title')}
      opened={poopEntryDrawerOpened}
      showStopTime={false}
      fromLabel={t('poop-entry-drawer-input-label-at')}
      saveLabel={t('poop-entry-drawer-button-label-save')}
    />
  );
}

export default EditPoopEntryDrawer;
