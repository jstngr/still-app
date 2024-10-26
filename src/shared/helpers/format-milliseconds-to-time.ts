/**
 * Formats a duration given in milliseconds to a time string in the format `HH`, `HH:MM`, or `HH:MM:SS`.
 *
 * @param milliseconds - The duration in milliseconds.
 * @param showSeconds - Optional. If `true`, includes seconds in the output format (default: `false`).
 * @param showMinutes - Optional. If `true`, includes minutes in the output format (default: `false`).
 * @returns A formatted time string in `HH`, `HH:MM`, or `HH:MM:SS` format.
 */
export default function formatMillisecondsToTime(
  milliseconds: number,
  showSeconds?: boolean,
  showMinutes?: boolean
): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  let text = paddedHours;
  if (showMinutes) {
    text += `:${paddedMinutes}`;
  }
  if (showSeconds) {
    text += `:${paddedSeconds}`;
  }

  return text;
}
