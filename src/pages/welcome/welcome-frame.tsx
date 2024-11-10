import { AppShell } from '@mantine/core';
import React from 'react';
import { Outlet } from 'react-router';

export default function WelcomeFrame() {
  return (
    <AppShell>
      <AppShell.Main p="env(safe-area-inset-top, 20px) env(safe-area-inset-left, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-right, 20px)">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
