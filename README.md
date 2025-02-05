## Getting Started

To begin, you'll need to install `node` (using brew):

```console
brew install node
```

Go to the directory of this prject and install the packages:

```console
npm ci
```

Start the app:

```console
npm start
```

App is reachable on `localhost:3000`

## App Overview

"Feed and Sleep" is a mobile application designed to assist parents in tracking their baby's feeding times and sleep patterns. Built using Capacitor and React, the app offers a range of features to enhance user experience and provide valuable insights into baby care routines.

### Core Functionality

1. **Feeding and Sleep Tracking**:

   - Track baby feeding times and sleep patterns with ease.

2. **User Interface and Navigation**:

   - Utilizes `Mantine` and `React Router` for a seamless UI and navigation experience.
   - Structured layout with `AppShell` for main content and footer navigation.

3. **Settings and Customization**:

   - Customize your experience through a dedicated settings page.
   - Manage user settings with `SettingsProvider`.

4. **SQLite Database**:

   - Local data storage using `CapacitorSQLite` for iOS, Android, and Electron platforms.

5. **Splash Screen and Keyboard Customization**:

   - Enhanced user experience with a splash screen during app launch.
   - Keyboard plugin adjusts layout for smooth user interaction.

6. **AdMob Integration**:

   - Monetize the app with integrated AdMob ads.

7. **In-App Review**:

   - Gather user feedback with in-app review functionality.

8. **Biometric Authentication**:

   - Configurations for biometric authentication on iOS and Android for secure access.

9. **Internationalization**:

   - Supports multiple languages with `i18next` for internationalization.

10. **Platform-Specific Configurations**:
    - Configured for iOS and Android platforms with specific settings.

### Development and Deployment

- **Development Server**:
  - Run on a local development server (`localhost:3000`) with hot reloading options.
- **Build and Deployment Scripts**:
  - Streamlined development workflow with scripts for building, testing, and deploying the app.

### Additional Features

- **Screen Lock and Keep Awake**:
  - Manage device screen behavior with `useScreenLock` and `useKeepAwake` hooks.

Overall, "Feed and Sleep" is a comprehensive app designed to assist parents in tracking their baby's feeding and sleeping patterns, with a focus on user experience, customization, and cross-platform compatibility.
