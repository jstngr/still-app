import { AppShell, Container, Stack } from '@mantine/core';
import AppTitle from 'components/app-title';
import Navigation from 'components/navigation/navigation';
import FeedTracker from 'pages/feed-tracker/feed-tracker.page';
import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { FeedingProvider } from 'service/feeding.service';
import { ThemeProvider } from 'theme';
import PoopPage from 'pages/poop/poop.page';
import SettingsPage from 'pages/settings/settings.page';
import StatisticsPage from 'pages/statistics/statistics.page';
import WelcomePage from 'pages/welcome/welcome.page';
import { PoopProvider } from 'service/poop.service';
import RoutingGuard from 'service/routing-guard';
import { SettingsContext, SettingsProvider } from 'service/settings.service';
import { SQLiteProvider } from 'service/sqlite/sqlite-provider';
import AppRoutes from 'shared/constants/app-routes';
import { SleepProvider } from 'service/sleep.service';
import SleepPage from 'pages/sleep/sleep.page';
import useScreenLock from 'shared/hooks/screen-lock';
import useKeepAwake from 'shared/hooks/keep-awake';
import { AppRatingProvider } from 'service/app-rating.service';
import { AppRefreshProvider } from 'service/app-refresh.service';
import AdMobBanner from 'components/admob-banner';

function AppFrame() {
  return (
    <AppShell>
      <AppShell.Main>
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
  useScreenLock();
  useKeepAwake();

  return (
    <ThemeProvider>
      <AppRefreshProvider>
        <SQLiteProvider>
          <SettingsProvider>
            <SettingsContext.Consumer>
              {(settings) => (
                <FeedingProvider>
                  <SleepProvider>
                    <PoopProvider>
                      <AppRatingProvider>
                        <RoutingGuard>
                          <Container p={0} maw="500px">
                            <Routes>
                              {!settings?.initialized && (
                                <>
                                  <Route
                                    path={AppRoutes.welcome.relative}
                                    element={<WelcomePage />}
                                  />
                                  <Route
                                    index
                                    element={<Navigate to={AppRoutes.welcome.absolute} replace />}
                                  />
                                </>
                              )}
                              {settings?.initialized && (
                                <>
                                  <Route path={AppRoutes.app.relative} element={<AppFrame />}>
                                    <Route
                                      path={AppRoutes.feeding.relative}
                                      element={<FeedTracker />}
                                    />
                                    {settings?.poopTrackerEnabled && (
                                      <Route
                                        path={AppRoutes.poop.relative}
                                        element={<PoopPage />}
                                      />
                                    )}
                                    {settings?.sleepTrackerEnabled && (
                                      <Route
                                        path={AppRoutes.sleep.relative}
                                        element={<SleepPage />}
                                      />
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
                      </AppRatingProvider>
                    </PoopProvider>
                  </SleepProvider>
                  <AdMobBanner />
                </FeedingProvider>
              )}
            </SettingsContext.Consumer>
          </SettingsProvider>
        </SQLiteProvider>
      </AppRefreshProvider>
    </ThemeProvider>
  );
}
