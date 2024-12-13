import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import {
  getFeedings2weeksFromDB,
  getPoops2weeksFromDB,
  IFeedingDataGroupedByDay,
  IFeedingDataGroupedByDayData,
  IPoopDataGroupedByDay,
  IPoopDataGroupedByDayData,
} from 'service/sqlite/statistics-last-week-database.helper';
import getLast7Days from 'shared/helpers/get-last-7-days';

export default function useLastWeek() {
  const { db, sqlReady } = useSQLiteContext();
  const weekDays = useMemo(getLast7Days, []);
  const { t } = useTranslation();

  const [feedingDataGroupedByDay, setFeedingDataGroupedByDay] = useState<IFeedingDataGroupedByDay>(
    {},
  );
  const [poopDataGroupedByDay, setPoopDataGroupedByDay] = useState<IPoopDataGroupedByDay>({});

  const loadData = async () => {
    const feedingDataGroupedByDayResult = await getFeedings2weeksFromDB(db);
    setFeedingDataGroupedByDay(feedingDataGroupedByDayResult);

    const poopDataGroupedByDayResult = await getPoops2weeksFromDB(db);
    console.log('🚀 ~ loadData ~ poopDataGroupedByDayResult:', poopDataGroupedByDayResult);
    setPoopDataGroupedByDay(poopDataGroupedByDayResult);
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

  const data: ({ day: string; weekDay: string } & IFeedingDataGroupedByDayData &
    IPoopDataGroupedByDayData)[] = weekDays.map(({ key, day }) => ({
    day: day,
    weekDay: getWeekDay(day, key),
    ...(feedingDataGroupedByDay[day] || {}),
    ...(poopDataGroupedByDay[day] || {}),
  }));

  data.sort((a, b) => (new Date(a.day).getTime() < new Date(b.day).getTime() ? 1 : -1));

  return { weekDays, data };
}
