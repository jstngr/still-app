/**
 * Converts a duration in milliseconds to a formatted string in `MM:SS` format.
 *
 * @param milliseconds - The duration in milliseconds.
 * @returns A string representing the time in `MM:SS` format.
 */
export default function formatMillisecondsToMinutesSeconds(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}
