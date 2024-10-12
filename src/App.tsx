import { AppShell, Container, MantineProvider, Stack } from '@mantine/core';
import AppTitle from 'components/app-title';
import Navigation from 'components/navigation/navigation';
import FeedTracker from 'pages/feed-tracker/feed-tracker.page';
import React, { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { FeedingProvider } from 'service/feeding.service';
import theme from 'theme';

import SettingsPage from 'pages/settings/settings.page';
import { SettingsProvider } from 'service/settings.service';
import { SQLiteProvider } from 'service/sqlite/sqlite-provider';

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
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  return (
    <MantineProvider theme={theme}>
      <SQLiteProvider>
        <FeedingProvider>
          <SettingsProvider>
            <Container p={0} maw="500px">
              <BrowserRouter>
                <Routes>
                  <Route path="*" element={<AppFrame />}>
                    <Route path="feed" element={<FeedTracker />} />
                    <Route path="poop" element={<div>Poop tracker</div>} />
                    <Route path="statistics" element={<div>Statistics</div>} />
                    <Route path="sleep" element={<div>Sleep</div>} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/feed" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </Container>
          </SettingsProvider>
        </FeedingProvider>
      </SQLiteProvider>
    </MantineProvider>
  );
}
