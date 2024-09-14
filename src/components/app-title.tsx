import { ActionIcon, Box, Flex, Title } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import React from 'react';

export default function AppTitle() {
  return (
    <Flex justify="center" pos={'relative'}>
      <Title order={1} size={'h1'} ff={'Dancing Script'} c="primary">
        Nina
      </Title>
      <Box pos={'absolute'} right="1rem">
        <ActionIcon variant="subtle">
          <IconSettings />
        </ActionIcon>
      </Box>
    </Flex>
  );
}
