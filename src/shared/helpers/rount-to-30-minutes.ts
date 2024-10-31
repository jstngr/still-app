/**
 * Rounds the given timestamp to the last or next 30-minute mark based on the provided direction.
 *
 * @param timestamp - The original timestamp in milliseconds.
 * @param direction - Specifies rounding direction: 'last' rounds down to the previous 30-minute mark,
 *                    'next' rounds up to the next 30-minute mark.
 * @returns A new timestamp rounded to the specified 30-minute mark.
 */
export default function roundTo30Minutes(timestamp: number, direction: 'last' | 'next'): number {
  const date = new Date(timestamp);
  const minutes = date.getMinutes();

  if (direction === 'last') {
    const roundedMinutes = minutes >= 30 ? 30 : 0;
    date.setMinutes(roundedMinutes, 0, 0);
  } else if (direction === 'next') {
    const roundedMinutes = minutes < 30 ? 30 : 60;
    date.setMinutes(roundedMinutes % 60, 0, 0);

    if (roundedMinutes === 60) {
      date.setHours(date.getHours() + 1);
    }
  }

  return date.getTime();
}
