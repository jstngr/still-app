/**
 * Converts a time string in `MM:SS` format to milliseconds.
 *
 * @param time - A string representing time in `MM:SS` format.
 * @returns The equivalent duration in milliseconds.
 * @throws Will throw an error if the input format is invalid.
 */
export default function formatMinutesSecondsToMilliseconds(time: string): number {
  const [minutes, seconds] = time.split(':').map(Number);

  if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
    throw new Error('Invalid time format. Expected MM:SS with valid minute and second values.');
  }

  return (minutes * 60 + seconds) * 1000;
}
