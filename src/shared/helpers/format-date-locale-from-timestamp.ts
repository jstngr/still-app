/**
 * Formats a given timestamp into a date string in the format DD. Month (e.g., 09. Sept).
 *
 * @param timestamp - The timestamp to format, in milliseconds since the Unix epoch.
 * @returns A formatted date string in DD. Month format.
 */
export default function formatDateLocaleFromTimestamp(timestamp: number): string {
  if (timestamp === 0) {
    return '-';
  }

  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
  const month = date.toLocaleString('en-US', { month: 'short' }); // Short month format (e.g., "Sept")

  return `${day}. ${month}`;
}
