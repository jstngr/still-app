/**
 * Formats a given number of seconds into a time string in the format MM:SS.
 * If the timestamp is 0, it returns "-".
 *
 * @param seconds - The Seconds to format
 * @returns The formatted time string in HH:MM format or "-" if the timestamp is 0.
 */
export default function formatSecondsToMinutesSeconds(seconds: number): string {
  if (seconds === 0) {
    return '-';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0'); // Always pad minutes
  const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // Always pad seconds

  return `${formattedMinutes}:${formattedSeconds}`;
}
