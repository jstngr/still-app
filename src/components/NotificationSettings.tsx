import React, { useState } from 'react';
import { ActionIcon, Switch, Stack, Drawer, Alert } from '@mantine/core';
import { IconAlarm, IconInfoCircle } from '@tabler/icons-react';
import { useSettingsContext } from '../service/settings.service';
import { useNotificationScheduler } from '../service/notification.service';
import { TimeInput } from '@mantine/dates';

const NotificationSettings: React.FC = () => {
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

  useNotificationScheduler();

  const handleToggleChange = (checked: boolean) => {
    saveNotificationsEnabled(checked);
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
        aria-label="Notification settings"
      >
        <IconAlarm />
      </ActionIcon>

      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notification Settings"
        size="sm"
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
            I can notify you when it is time to feed {babyName} again. Just tell me how much time
            after the last meal you want to be notified.
          </Alert>

          <Switch
            label="Enable Reminders"
            checked={notificationsEnabled}
            onChange={(event) => handleToggleChange(event.currentTarget.checked)}
          />

          <TimeInput
            label="Time after last meal"
            onChange={handleTimeChange}
            disabled={!notificationsEnabled}
            value={`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`}
          />
        </Stack>
      </Drawer>
    </>
  );
};

export default NotificationSettings;
