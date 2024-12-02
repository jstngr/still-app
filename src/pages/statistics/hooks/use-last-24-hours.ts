import { useSQLiteContext } from 'service/sqlite/sqlite-provider';

export default function useLast24Hours() {
  const { db, sqlReady } = useSQLiteContext();

  return {};
}
