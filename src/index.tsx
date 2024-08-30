import App from 'App';
import React from 'react';
import { createRoot } from 'react-dom/client';

import 'normalize.css';
import '@fontsource/poppins';
import '@fontsource/dancing-script';
import './index.css';
import './i18n';

import '@mantine/core/styles.css';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<App />);
