/**
 * Removes milliseconds and seconds from a timestamp, returning the rounded-down timestamp.
 *
 * @param timestamp - The original timestamp in milliseconds.
 * @returns The timestamp rounded down to the nearest minute, in milliseconds.
 */
function removeMillisecondsAndSeconds(timestamp: number): number {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date.getTime();
}
