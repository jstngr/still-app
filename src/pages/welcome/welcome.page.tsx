import { AppShell, Container, Flex, ScrollArea } from '@mantine/core';
import React from 'react';
import { Route, Routes } from 'react-router';
import WelcomeViewWelcome from './welcome-view-welcome';
import AppRoutes from 'shared/constants/app-routes';
import WelcomeViewName from './welcome-view-name';
import WelcomeViewSettings from './welcome-view-settings';
import WelcomeViewFinish from './welcome-view-finish';
import WelcomeViewFeeding from './welcome-view-feeding';
import styles from './welcome.module.css';

export default function WelcomePage() {
  return (
    <AppShell>
      <AppShell.Main
        p="env(safe-area-inset-top, 20px) env(safe-area-inset-left, 20px) 0 env(safe-area-inset-right, 20px)"
        h="100%"
        display="flex"
      >
        <ScrollArea flex="1 0 100%" className={styles.scroll}>
          <Container flex="1 0 100%" w="100%">
            <Flex gap="lg" h="100%" align="center" justify="center" direction="column">
              <Routes>
                <Route path="" element={<WelcomeViewWelcome />} />
                <Route path={AppRoutes.welcomeName.relative} element={<WelcomeViewName />} />
                <Route
                  path={AppRoutes.welcomeSettings.relative}
                  element={<WelcomeViewSettings />}
                />
                <Route path={AppRoutes.welcomeFeeding.relative} element={<WelcomeViewFeeding />} />

                <Route path={AppRoutes.welcomeFinish.relative} element={<WelcomeViewFinish />} />
              </Routes>
            </Flex>
          </Container>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
