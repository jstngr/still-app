import { LocalNotifications } from '@capacitor/local-notifications';
import { useEffect } from 'react';
import { useSettingsContext } from './settings.service';
import { useFeedingContext } from './feeding.service';
import FeedingEntry from 'classes/feeding-entry.class';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export const NOTIFICATION_ID = 1;

export async function scheduleNotification(
  t: TFunction,
  {
    hours,
    minutes,
    baseTime,
    babyName,
  }: {
    hours: number;
    minutes: number;
    baseTime: number;
    babyName: string;
  },
) {
  try {
    // Request permission
    const permissionStatus = await LocalNotifications.requestPermissions();
    if (permissionStatus.display !== 'granted') {
      console.error('Notification permission not granted');
      return;
    }

    // Cancel any existing notifications
    await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });

    // Calculate the trigger time in milliseconds
    const totalMinutes = hours * 60 + minutes;
    const triggerInMs = totalMinutes * 60 * 1000;

    let body = '';
    if (hours === 0) {
      body = t('notification-settings-info-minutes_one', { minutes, count: minutes });
    } else if (minutes !== 0) {
      body = t('notification-settings-info-hours-minutes', { hours, minutes });
    } else {
      body = t('notification-settings-info-hours_one', { hours, count: hours });
    }

    // Schedule the notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: NOTIFICATION_ID,
          title: t('notification-feeding-reminder-title', { babyName }),
          body,
          schedule: { at: new Date(baseTime + triggerInMs) },
          sound: 'beep.wav',
          actionTypeId: '',
          extra: null,
        },
      ],
    });

    console.log('Notification scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

export function useNotificationScheduler() {
  const { t } = useTranslation();
  const settings = useSettingsContext();
  const { feedingEntries } = useFeedingContext();
  const lastEntry = feedingEntries[0];
  const lastFeeding = lastEntry ? new FeedingEntry(lastEntry) : undefined;
  const baseTime = lastFeeding?.getStopped() || 0;

  useEffect(() => {
    if (settings.notificationsEnabled) {
      if (baseTime < Date.now()) {
        return;
      }
      scheduleNotification(t, {
        babyName: settings.babyName,
        hours: settings.notificationHours,
        minutes: settings.notificationMinutes,
        baseTime,
      });
    } else {
      // Cancel notifications if disabled
      LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] }).catch((error) =>
        console.error('Error canceling notifications:', error),
      );
    }
  }, [settings.notificationsEnabled, settings.notificationHours, settings.notificationMinutes]);
}

export async function cancelAllNotifications() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
    console.log('All notifications canceled');
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

export async function askForNotificationPermission() {
  // Request permission
  const permissionStatus = await LocalNotifications.requestPermissions();
  if (permissionStatus.display !== 'granted') {
    console.error('Notification permission not granted');
    return false;
  }
  return true;
}

export async function checkNotificationPermission() {
  const permissionStatus = await LocalNotifications.checkPermissions();
  return permissionStatus.display;
}
