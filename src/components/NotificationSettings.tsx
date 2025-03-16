import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Switch,
  Stack,
  Drawer,
  Alert,
  Button,
  Group,
  List,
  Divider,
  Text,
} from '@mantine/core';
import { IconAlarm, IconInfoCircle, IconAlertCircle, IconSettings } from '@tabler/icons-react';
import { useSettingsContext } from '../service/settings.service';
import {
  askForNotificationPermission,
  checkNotificationPermission,
  useNotificationScheduler,
} from '../service/notification.service';
import { TimeInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { NativeSettings, IOSSettings, AndroidSettings } from 'capacitor-native-settings';

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();
  const {
    notificationsEnabled,
    notificationHours,
    notificationMinutes,
    saveNotificationsEnabled,
    saveNotificationTime,
    babyName,
  } = useSettingsContext();
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(notificationHours);
  const [minutes, setMinutes] = useState(notificationMinutes);
  const [showPermissionError, setShowPermissionError] = useState(false);

  useNotificationScheduler();

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await checkNotificationPermission();
      if (permission === 'denied') {
        setShowPermissionError(true);
        saveNotificationsEnabled(false);
      } else {
        setShowPermissionError(false);
      }
    };
    checkPermission();
  }, [isOpen]);

  const handleToggleChange = async (checked: boolean) => {
    try {
      const permissionGranted = await askForNotificationPermission();
      if (permissionGranted) {
        saveNotificationsEnabled(checked);
        setShowPermissionError(false);
      } else {
        setShowPermissionError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openSettings = async () => {
    try {
      setIsOpen(false);
      await NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  };

  const handleTimeChange = (event) => {
    const value = event.currentTarget.value;
    const splitted = value.split(':');
    const hours = splitted[0];
    let minutes = splitted[1];
    if (parseInt(hours, 10) === 0 && parseInt(minutes, 10) < 5) {
      minutes = '05';
    }
    setHours(Number(hours));
    setMinutes(Number(minutes));
    saveNotificationTime({ hours, minutes });
  };

  return (
    <>
      <ActionIcon
        variant="subtle"
        onClick={() => setIsOpen(true)}
        aria-label={t('notification-settings-button-aria')}
      >
        <IconAlarm />
      </ActionIcon>

      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('notification-settings-title')}
        size={showPermissionError ? 'lg' : 'md'}
        position="bottom"
        styles={{
          content: {
            display: 'flex',
            flexDirection: 'column',
          },
          body: {
            flexGrow: '1',
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 'env(safe-area-inset-bottom, 20px)',
          },
        }}
      >
        <Stack align="stretch" maw="500px" flex="1">
          <Alert color="blue" variant="" icon={<IconInfoCircle />}>
            {t('notification-settings-info', { babyName })}
          </Alert>

          {showPermissionError && (
            <Alert color="red" variant="" icon={<IconAlertCircle />}>
              <Stack gap="xs">
                <Text size="sm">{t('notification-settings-permission-error-title')}</Text>
                <Group justify="flex-start">
                  <Button
                    leftSection={<IconSettings size={16} />}
                    variant="light"
                    onClick={openSettings}
                  >
                    {t('notification-settings-open-settings')}
                  </Button>
                </Group>

                <Divider label={t('or')} />

                <List spacing="xs" size="sm">
                  <List.Item>{t('notification-settings-permission-error-step-1')}</List.Item>
                  <List.Item>{t('notification-settings-permission-error-step-2')}</List.Item>
                  <List.Item>{t('notification-settings-permission-error-step-3')}</List.Item>
                  <List.Item>{t('notification-settings-permission-error-step-4')}</List.Item>
                </List>
              </Stack>
            </Alert>
          )}

          {!showPermissionError && (
            <>
              <Switch
                label={t('notification-settings-enable-reminders')}
                checked={notificationsEnabled}
                onChange={(event) => handleToggleChange(event.currentTarget.checked)}
              />

              <TimeInput
                label={t('notification-settings-time-after-last-meal')}
                onChange={handleTimeChange}
                disabled={!notificationsEnabled}
                value={`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`}
              />
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default NotificationSettings;
