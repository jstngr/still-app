import {
  AppShell,
  Button,
  Container,
  Flex,
  Grid,
  MantineProvider,
  SimpleGrid,
} from '@mantine/core';
import React from 'react';
import theme from 'theme';
import { IonContent } from '@ionic/react';

import NavButton from 'components/navigation/nav-button';
import { IconPoo } from '@tabler/icons-react';
import Navigation from 'components/navigation/navigation';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container p={0} maw="500px">
        <AppShell>
          <AppShell.Main p="env(safe-area-inset-top, 20px) env(safe-area-inset-left, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-right, 20px)">
            <span>Blaaa</span>
          </AppShell.Main>
          <AppShell.Footer>
            <Navigation />
          </AppShell.Footer>
        </AppShell>
      </Container>
    </MantineProvider>
  );
}
