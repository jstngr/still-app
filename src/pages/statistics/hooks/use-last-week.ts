import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSQLiteContext } from 'service/sqlite/sqlite-provider';
import {
  getFeedings2weeksFromDB,
  getPoops2weeksFromDB,
  getSleeps2weeksFromDB,
  IFeedingDataGroupedByDay,
  IFeedingDataGroupedByDayData,
  IPoopDataGroupedByDay,
  IPoopDataGroupedByDayData,
  ISleepDataGroupedByDay,
  ISleepDataGroupedByDayData,
} from 'service/sqlite/statistics-last-week-database.helper';
import getLast7Days from 'shared/helpers/get-last-7-days';

export type ILastWeekData = ({ day: string; weekDay: string } & IFeedingDataGroupedByDayData &
  IPoopDataGroupedByDayData &
  ISleepDataGroupedByDayData)[];

export default function useLastWeek() {
  const { db, sqlReady } = useSQLiteContext();
  const weekDays = useMemo(getLast7Days, []);
  const { t } = useTranslation();

  const [feedingDataGroupedByDay, setFeedingDataGroupedByDay] = useState<IFeedingDataGroupedByDay>(
    {},
  );
  const [poopDataGroupedByDay, setPoopDataGroupedByDay] = useState<IPoopDataGroupedByDay>({});
  const [sleepDataGroupedByDay, setSleepDataGroupedByDay] = useState<ISleepDataGroupedByDay>({});

  const loadData = async () => {
    const feedingDataGroupedByDayResult = await getFeedings2weeksFromDB(db);
    setFeedingDataGroupedByDay(feedingDataGroupedByDayResult);

    const poopDataGroupedByDayResult = await getPoops2weeksFromDB(db);
    setPoopDataGroupedByDay(poopDataGroupedByDayResult);

    const sleepDataGroupedByDayResult = await getSleeps2weeksFromDB(db);
    setSleepDataGroupedByDay(sleepDataGroupedByDayResult);
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

  const data: ILastWeekData = weekDays.map(({ key, day }) => ({
    day: day,
    weekDay: getWeekDay(day, key),
    ...(feedingDataGroupedByDay[day] || {}),
    ...(poopDataGroupedByDay[day] || {}),
    ...(sleepDataGroupedByDay[day] || {}),
  }));

  data.sort((a, b) => (new Date(a.day).getTime() < new Date(b.day).getTime() ? 1 : -1));

  return { weekDays, data };
}
