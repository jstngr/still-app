import { ActionIcon, Box, Flex, Title } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { useSettingsContext } from 'service/settings.service';

export default function AppTitle() {
  const navigate = useNavigate();
  const { babyName } = useSettingsContext();
  return (
    <Flex justify="center" pos={'relative'}>
      <Title order={1} ff={'Dancing Script'} c="primary">
        {babyName || '-'}
      </Title>
      <Box pos={'absolute'} right="1rem">
        <ActionIcon variant="subtle" onClick={() => navigate('settings')}>
          <IconSettings />
        </ActionIcon>
      </Box>
    </Flex>
  );
}
