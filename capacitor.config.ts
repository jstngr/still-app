import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "de.mini-genie.feedandsleep",
  "appName": "Feed and Sleep",
  "bundledWebRuntime": false,
  "webDir": "build",
  "plugins": {
    "CapacitorSQLite": {
      "iosDatabaseLocation": "Library/CapacitorDatabase",
      "iosIsEncryption": false,
      "iosKeychainPrefix": "cap",
      "iosBiometric": {
        "biometricAuth": false,
        "biometricTitle": "Biometric login for capacitor sqlite"
      },
      "androidIsEncryption": false,
      "androidBiometric": {
        "biometricAuth": false,
        "biometricTitle": "Biometric login for capacitor sqlite",
        "biometricSubTitle": "Log in using your biometric"
      },
      "electronWindowsLocation": "C:\\ProgramData\\CapacitorDatabases",
      "electronMacLocation": "YOUR_VOLUME/CapacitorDatabases",
      "electronLinuxLocation": "Databases"
    },
    "SplashScreen": {
      "launchShowDuration": 2000,
      "launchAutoHide": false,
      "backgroundColor": "#ffffff",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "spinnerStyle": "large",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true
    },
    "Keyboard": {
      "resize": "body",
      "style": "DARK",
      "resizeOnFullScreen": true
    },
    "AdMob": {
      "appId": "ca-app-pub-3385049365741222~1441830408",
      "autoShow": true,
      "requestTrackingAuthorization": true
    }
  },
  "server": {
    "url": "http://192.168.178.22:3000",
    "cleartext": true,
    "androidScheme": "http"
  },
  "android": {
    "allowMixedContent": true
  }
};

export default config;
