export default function formatTime(
  seconds: number,
  showSeconds: boolean = true,
  showMinutes: boolean = true,
) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, '0'); // Always pad hours
  const formattedMinutes = String(minutes).padStart(2, '0'); // Always pad minutes
  const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // Always pad seconds

  if (hours > 0) {
    return `${formattedHours}${showMinutes ? `:${formattedMinutes}` : ''}${showSeconds ? `:${formattedSeconds}` : ''}`;
  } else {
    return `${formattedMinutes}${showSeconds ? `:${formattedSeconds}` : ''}`;
  }
}
