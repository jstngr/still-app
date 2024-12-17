import App from 'App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { BrowserRouter } from 'react-router-dom';

import 'normalize.css';
import '@fontsource/poppins';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/dancing-script';
import './index.css';
import './i18n';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

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
