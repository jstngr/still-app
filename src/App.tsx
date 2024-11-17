import { AppShell, Button, Container, MantineProvider, Stack } from '@mantine/core';
import AppTitle from 'components/app-title';
import Navigation from 'components/navigation/navigation';
import FeedTracker from 'pages/feed-tracker/feed-tracker.page';
import React from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
import { FeedingProvider } from 'service/feeding.service';
import theme from 'theme';
import PoopPage from 'pages/poop/poop.page';
import SettingsPage from 'pages/settings/settings.page';
import StatisticsPage from 'pages/statistics/statistics.page';
import WelcomePage from 'pages/welcome/welcome.page';
import { PoopProvider } from 'service/poop.service';
import RoutingGuard from 'service/routing-guard';
import { SettingsContext, SettingsProvider } from 'service/settings.service';
import { SQLiteProvider } from 'service/sqlite/sqlite-provider';
import AppRoutes from 'shared/constants/app-routes';

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

function Bla({ to }) {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => {
          navigate(to);
        }}
      >
        {to}
      </Button>
    </>
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
                  <RoutingGuard>
                    <Container p={0} maw="500px">
                      <Routes>
                        {!settings?.initialized && (
                          <>
                            <Route path={AppRoutes.welcome.relative} element={<WelcomePage />} />
                            <Route
                              index
                              element={<Navigate to={AppRoutes.welcome.absolute} replace />}
                            />
                          </>
                        )}
                        {settings?.initialized && (
                          <>
                            <Route path={AppRoutes.app.relative} element={<AppFrame />}>
                              <Route path={AppRoutes.feeding.relative} element={<FeedTracker />} />
                              {settings?.poopTrackerEnabled && (
                                <Route path={AppRoutes.poop.relative} element={<PoopPage />} />
                              )}
                              {settings?.sleepTrackerEnabled && (
                                <Route path={AppRoutes.sleep.relative} element={<div>Sleep</div>} />
                              )}
                              <Route
                                path={AppRoutes.statistics.relative}
                                element={<StatisticsPage />}
                              />
                              <Route
                                path={AppRoutes.settings.relative}
                                element={<SettingsPage />}
                              />
                              <Route
                                index
                                element={<Navigate to={AppRoutes.feeding.absolute} replace />}
                              />
                            </Route>
                            <Route
                              index
                              element={<Navigate to={AppRoutes.app.absolute} replace />}
                            />
                          </>
                        )}
                      </Routes>
                    </Container>
                  </RoutingGuard>
                </PoopProvider>
              )}
            </SettingsContext.Consumer>
          </SettingsProvider>
        </FeedingProvider>
      </SQLiteProvider>
    </MantineProvider>
  );
}
