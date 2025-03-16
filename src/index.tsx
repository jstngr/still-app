import App from 'App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';

import 'normalize.css';
import '@fontsource/poppins';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/dancing-script';
import './index.css';
import './i18n';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

// Initialize custom elements
if (!Capacitor.isNativePlatform()) {
  jeepSqlite(window);
}

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
