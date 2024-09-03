import { Divider, Flex, Stack, Title } from '@mantine/core';
import React from 'react';

export default function AppTitle(props) {
  return (
    <Flex justify="center">
      <Stack gap="sm">
        <Title order={1} size={'h1'} ff={'Dancing Script'} c="primary">
          Nina
        </Title>
        <Divider size="sm" />
      </Stack>
    </Flex>
  );
}
