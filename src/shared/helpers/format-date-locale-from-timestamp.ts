import { TFunction } from 'i18next';

/**
 * Formats a given timestamp into a date string in the format DD. Month (e.g., 09. Sept).
 *
 * @param timestamp - The timestamp to format, in milliseconds since the Unix epoch.
 * @returns A formatted date string in DD. Month format.
 */
export default function formatDateLocaleFromTimestamp(
  timestamp: number,
  t: TFunction,
  i18n,
): string {
  if (timestamp === 0) {
    return '-';
  }

  if (isSameDay(timestamp, new Date().getTime())) return t('today');

  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
  const month = date.toLocaleString(i18n.language, { month: 'long' }); // Short month format (e.g., "Sept")

  return `${day}. ${month}`;
}

function isSameDay(timestamp1: number, timestamp2: number) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  if (date1.getDate() !== date2.getDate()) return false;
  if (date1.getMonth() !== date2.getMonth()) return false;
  if (date1.getFullYear() !== date2.getFullYear()) return false;
  return true;
}
