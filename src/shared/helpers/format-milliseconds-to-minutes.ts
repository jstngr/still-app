/**
 * Converts a duration in milliseconds to a formatted string in `MM` format.
 *
 * @param milliseconds - The duration in milliseconds.
 * @returns A string representing the time in `MM` format.
 */
export default function formatMillisecondsToMinutes(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  console.log('🚀 ~ formatMillisecondsToMinutes ~ totalSeconds:', totalSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  console.log('🚀 ~ formatMillisecondsToMinutes ~ minutes:', minutes);

  const paddedMinutes = String(minutes).padStart(2, '0');
  console.log('🚀 ~ formatMillisecondsToMinutes ~ paddedMinutes:', paddedMinutes);

  return `${paddedMinutes}`;
}
