import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'de.mini-genie.feedandsleep',
  appName: 'Feed and Sleep',
  bundledWebRuntime: false,
  webDir: 'build',
  server: {
    // hot reload
    // url: 'http://192.168.178.22:3000',
    url: 'http://localhost:3000',
    cleartext: true,
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'cap',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
        biometricSubTitle: 'Log in using your biometric',
      },
      electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
      electronMacLocation: 'YOUR_VOLUME/CapacitorDatabases',
      electronLinuxLocation: 'Databases',
    },
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

// server: {
//   // hot reload
//   // url: 'http://192.168.178.22:3000',
//   // url: 'http://localhost:3000',
//   cleartext: true,
// },
