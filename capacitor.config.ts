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
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Show splash for 3 seconds
      launchAutoHide: false, // Automatically hide splash screen after 3 seconds
      backgroundColor: '#ffffff', // Splash screen background color
      androidScaleType: 'CENTER_CROP', // How the splash image is scaled on Android
      showSpinner: true, // Show loading spinner
      spinnerStyle: 'large', // Spinner style
      spinnerColor: '#999999', // Spinner color
      splashFullScreen: true, // Fullscreen mode for the splash screen
      splashImmersive: true, // Immersive mode (Android)
    },
  },
};

export default config;
