import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.minigenie.stillapp',
  appName: 'MiniGenie - Still App',
  webDir: 'build',
  server: {
    // hot reload
    url: 'http://192.168.178.22:3000',
    cleartext: true,
  },
};

export default config;
