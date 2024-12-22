import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.minigenie.stillapp',
  appName: 'Still App',
  bundledWebRuntime: false,
  webDir: 'build',
  server: {
    // hot reload
    url: 'http://192.168.178.22:3000',
    // url: 'http://localhost:3000',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Show splash for 3 seconds
      launchAutoHide: false, // Automatically hide splash screen after 3 seconds
      backgroundColor: '#ffffff', // Splash screen background color
      androidScaleType: 'CENTER_CROP', // How the splash image is scaled on Android
      showSpinner: true, // Show loading spinner
      spinnerStyle: 'large', // Spinner style
      spinnerColor: '#999999', // Spinner color
      splashFullScreen: true, // Fullscreen mode for the splash screen
      splashImmersive: true, // Immersive mode (Android)
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
