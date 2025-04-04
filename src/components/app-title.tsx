import { ActionIcon, Box, Flex, Group, Title } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSettingsContext } from 'service/settings.service';
import AppRoutes from 'shared/constants/app-routes';
import NotificationSettings from './NotificationSettings';

export default function AppTitle() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { babyName } = useSettingsContext();

  const onNavigate = () => {
    if (pathname.includes(AppRoutes.settings.absolute)) {
      navigate(-1);
      return;
    }
    navigate(AppRoutes.settings.absolute);
  };

  return (
    <Flex justify="center" pos={'relative'}>
      <Title order={1} ff={'Dancing Script'} c="primary">
        {babyName || '-'}
      </Title>
      <Box pos={'absolute'} right="1rem">
        <Group gap="sm">
          <NotificationSettings />
          <ActionIcon variant="subtle" onClick={onNavigate}>
            <IconSettings />
          </ActionIcon>
        </Group>
      </Box>
    </Flex>
  );
}
