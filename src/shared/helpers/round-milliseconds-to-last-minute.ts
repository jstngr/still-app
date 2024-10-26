/**
 * Rounds a duration in milliseconds down to the nearest minute.
 *
 * @param milliseconds - The duration in milliseconds.
 * @returns The duration rounded down to the nearest minute, in milliseconds.
 */
export default function roundMillisecondsToLastMinute(milliseconds: number): number {
  const oneMinuteInMs = 60000;
  return Math.floor(milliseconds / oneMinuteInMs) * oneMinuteInMs;
}
