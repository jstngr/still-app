import { AppShell, Container, MantineProvider, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import theme from 'theme';
import { SplashScreen } from '@capacitor/splash-screen';
import AppTitle from 'components/app-title';
import Navigation from 'components/navigation/navigation';
import FeedTracker from 'pages/feed-tracker/feed-tracker.page';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { FeedingProvider } from 'service/feeding.service';
import sqliteService from 'service/sqlite-service';

import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import SettingsPage from 'pages/settings/settings.page';
import { SettingsProvider } from 'service/settings-service';

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
  const [databaseLoading, setDatabaseLoading] = useState(true);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      jeepSqlite(window);
    }
  }, []);

  // Initialize the database on component mount
  useEffect(() => {
    const initDb = async () => {
      await sqliteService.initDb();
      setDatabaseLoading(false);
      SplashScreen.hide();
    };
    initDb();

    // Close the database on component unmount
    return () => {
      sqliteService.closeDb();
    };
  }, []);

  return (
    <MantineProvider theme={theme}>
      <FeedingProvider>
        <SettingsProvider databaseReady={!databaseLoading}>
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
    </MantineProvider>
  );
}
