interface UseHistoryEditProps<T> {
  data: T[];
  onEdit: (id: number) => void;
}

export function useHistoryEdit<T extends { id?: number }>({
  data,
  onEdit,
}: UseHistoryEditProps<T>) {
  const handleEdit = (id: number) => {
    const entry = data.find((e) => e.id === id);
    if (!entry || !entry.id) return;
    onEdit(entry.id);
  };

  return { handleEdit };
}
