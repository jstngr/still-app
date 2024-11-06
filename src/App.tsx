import { AppShell, Container, MantineProvider, Stack } from '@mantine/core';
import AppTitle from 'components/app-title';
import Navigation from 'components/navigation/navigation';
import FeedTracker from 'pages/feed-tracker/feed-tracker.page';
import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { FeedingProvider } from 'service/feeding.service';
import theme from 'theme';

import SettingsPage from 'pages/settings/settings.page';
import { SettingsContext, SettingsProvider } from 'service/settings.service';
import { SQLiteProvider } from 'service/sqlite/sqlite-provider';
import StatisticsPage from 'pages/statistics/statistics.page';
import PoopPage from 'pages/poop/poop.page';
import { PoopProvider } from 'service/poop.service';

function AppFrame() {
  return (
    <AppShell>
      <AppShell.Main p="env(safe-area-inset-top, 20px) env(safe-area-inset-left, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-right, 20px)">
        <Stack h="100%" gap="xl">
          <AppTitle />
          <Outlet />
        </Stack>
      </AppShell.Main>
      <AppShell.Footer>
        <Navigation />
      </AppShell.Footer>
    </AppShell>
  );
}

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <SQLiteProvider>
        <FeedingProvider>
          <SettingsProvider>
            <SettingsContext.Consumer>
              {(settings) => (
                <PoopProvider>
                  <Container p={0} maw="500px">
                    <BrowserRouter>
                      <Routes>
                        <Route path="*" element={<AppFrame />}>
                          <Route path="feed" element={<FeedTracker />} />
                          {settings?.poopTrackerEnabled && (
                            <Route path="poop" element={<PoopPage />} />
                          )}
                          {settings?.sleepTrackerEnabled && (
                            <Route path="sleep" element={<div>Sleep</div>} />
                          )}
                          <Route path="statistics" element={<StatisticsPage />} />
                          <Route path="settings" element={<SettingsPage />} />
                          <Route path="*" element={<Navigate to="/feed" replace />} />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </Container>
                </PoopProvider>
              )}
            </SettingsContext.Consumer>
          </SettingsProvider>
        </FeedingProvider>
      </SQLiteProvider>
    </MantineProvider>
  );
}
