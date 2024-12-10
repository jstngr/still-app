import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import {
  emptyDataGroupedByDayState,
  getFeedings2weeksFromDB,
  IDataGroupedByDay,
} from 'service/sqlite/statistics-last-week-database.helper';
import getLast7Days from 'shared/helpers/get-last-7-days';

export default function useLastWeek() {
  const { db, sqlReady } = useSQLiteContext();
  const weekDays = useMemo(getLast7Days, []);
  const { t } = useTranslation();

  const [feedingDataGroupedByDay, setFeedingDataGroupedByDay] = useState<IDataGroupedByDay>(
    emptyDataGroupedByDayState,
  );

  const loadData = async () => {
    const feedingDataGroupedByDayResult = await getFeedings2weeksFromDB(db);

    setFeedingDataGroupedByDay(feedingDataGroupedByDayResult);
  };

  useEffect(() => {
    if (!sqlReady) return;
    loadData();
  }, [sqlReady]);

  const getWeekDay = (day, key) => {
    const today = new Date().toISOString().split('T')[0];
    if (day === today) return t('statistics-page-last-week-label-today');
    return t(`week-day-${key}`);
  };

  const data: ({ day: string; weekDay: number } & IDataGroupedByDay)[] = weekDays.map(
    ({ key, day }) =>
      ({
        day: day,
        weekDay: getWeekDay(day, key),
        ...(feedingDataGroupedByDay[day] || {}),
      }) as { day: string; weekDay: number } & IDataGroupedByDay,
  );

  data.sort((a, b) => (new Date(a.day).getTime() < new Date(b.day).getTime() ? 1 : -1));
  return { weekDays, data };
}
