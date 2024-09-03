import { AppShell, Container, Divider, Flex, MantineProvider, Stack, Title } from '@mantine/core';
import React from 'react';
import theme from 'theme';

import Navigation from 'components/navigation/navigation';
import FeedTracker from 'pages/feed-tracker/feed-tracker.page';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import AppTitle from 'components/app-title';

function AppFrame() {
  return (
    <AppShell>
      <AppShell.Main p="env(safe-area-inset-top, 20px) env(safe-area-inset-left, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-right, 20px)">
        <Stack>
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
      <Container p={0} maw="500px">
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AppFrame />}>
              <Route path="feed-tracker" element={<FeedTracker />} />
              <Route path="poop-tracker" element={<div>Poop tracker</div>} />
              <Route path="statistics" element={<div>Statistics</div>} />
              <Route path="*" element={<Navigate to="/feed-tracker" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </MantineProvider>
  );
}
