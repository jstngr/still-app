import { useEffect, useState } from 'react';

export interface EntryBase {
  id?: string | number;
  created?: number;
  started?: number;
  stopped?: number;
}

interface UseEntryFormProps<T extends EntryBase> {
  entry: T | undefined;
  onSave: (entry: T) => void;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  EntryClass?: new (data: T) => T;
}

export function useEntryForm<T extends EntryBase>({
  entry,
  onSave,
  onClose,
  onDelete,
  EntryClass,
}: UseEntryFormProps<T>) {
  const [formData, setFormData] = useState<T | undefined>(entry);

  useEffect(() => {
    setFormData(entry);
  }, [entry?.id]);

  const updateForm = (key: keyof T, value: T[keyof T]) => {
    setFormData(
      (current) =>
        ({
          ...current,
          [key]: value,
        }) as T,
    );
  };

  const handleSave = () => {
    if (formData) {
      const entryInstance = EntryClass ? new EntryClass(formData) : formData;
      onSave(entryInstance);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (entry?.id && onDelete) {
      await onDelete(entry.id.toString());
    }
    onClose();
  };

  const timeToTimeStamp = (original: number, time: string) => {
    const hours = parseInt(time.split(':')[0], 10);
    const minutes = parseInt(time.split(':')[1], 10);
    const date = new Date(original);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.getTime();
  };

  const timeStampToTime = (original: number) => {
    const date = new Date(original);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const updateTimeField = (field: keyof T, time: string, referenceTimestamp: number) => {
    updateForm(field, timeToTimeStamp(referenceTimestamp, time) as T[keyof T]);
  };

  const getTimeValue = (timestamp: number) => {
    return timeStampToTime(timestamp);
  };

  const updateDateField = (field: keyof T, date: Date | null, currentTimestamp: number) => {
    if (!date) return;
    const currentDate = new Date(currentTimestamp);
    date.setHours(currentDate.getHours());
    date.setMinutes(currentDate.getMinutes());
    updateForm(field, date.getTime() as T[keyof T]);
  };

  const getDateValue = (timestamp: number) => {
    return new Date(timestamp);
  };

  return {
    formData,
    updateForm,
    updateTimeField,
    getTimeValue,
    updateDateField,
    getDateValue,
    handleSave,
    handleDelete,
    handleClose: onClose,
  };
}
