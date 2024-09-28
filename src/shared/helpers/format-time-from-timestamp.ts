/**
 * Formats a given timestamp into a time string in the format HH:MM.
 * If the timestamp is 0, it returns "-".
 *
 * @param timestamp - The timestamp to format, in milliseconds since the Unix epoch.
 * @returns The formatted time string in HH:MM format or "-" if the timestamp is 0.
 */
export default function formatTimeFromTimestamp(timestamp: number): string {
  if (timestamp === 0) {
    return '-';
  }

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}
