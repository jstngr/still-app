/**
 * Removes the minutes, seconds, and milliseconds from a given timestamp.
 *
 * @param timestamp - The original timestamp in milliseconds.
 * @returns The timestamp rounded down to the nearest hour, with minutes, seconds, and milliseconds set to zero.
 */
export default function removeMinutesSecondsMilliseconds(timestamp: number): number {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0);
  return date.getTime();
}
