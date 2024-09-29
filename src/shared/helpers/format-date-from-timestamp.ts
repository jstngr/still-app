/**
 * Formats a given timestamp into a date string in the format DD/MM.
 *
 * @param timestamp - The timestamp to format, in milliseconds since the Unix epoch.
 * @returns The formatted date string in DD/MM format.
 */
export default function formatDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}/${month}`;
}
