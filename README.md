# Feed and Sleep

A comprehensive mobile application for tracking baby feeding times and sleep patterns, built with React and Capacitor.

## Getting Started

### Prerequisites

- Node.js (install via brew):
  ```console
  brew install node
  ```
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```console
   npm ci
   ```
3. Start the development server:
   ```console
   npm start
   ```
   App will be available at `localhost:3000`

### Building for Mobile Platforms

#### iOS

```console
npm run build
npx cap sync ios
npx cap open ios
```

#### Android

```console
npm run build
npx cap sync android
npx cap open android
```

## App Overview

"Feed and Sleep" is a mobile application designed to assist parents in tracking their baby's feeding times and sleep patterns. Built using Capacitor and React, the app offers a range of features to enhance user experience and provide valuable insights into baby care routines.

### Core Functionality

1. **Feeding and Sleep Tracking**:

   - Track baby feeding times with precise timing
   - Monitor sleep patterns and durations
   - Historical data viewing and analysis
   - Real-time tracking capabilities

2. **User Interface and Navigation**:

   - Modern UI built with `Mantine` components
   - Responsive design for various screen sizes
   - Intuitive navigation using `React Router`
   - Structured layout with `AppShell`
   - Bottom navigation for easy access

3. **Data Management**:

   - Local data storage using `CapacitorSQLite`
   - Platform-specific database locations:
     - iOS: `Library/CapacitorDatabase`
     - Android: App-specific storage
     - Windows: `C:\\ProgramData\\CapacitorDatabases`
   - Optional encryption support
   - Automatic data backup

4. **AdMob Integration**:

   - Banner ads implementation
   - GDPR compliance with consent management
   - iOS App Tracking Transparency support
   - Production and test ad units:
     ```typescript
     BANNER_AD_ID = {
       PROD: "ca-app-pub-3385049365741222/3427416213",
       TEST: "ca-app-pub-3940256099942544/2435281174",
     };
     ```
   - Adaptive banner sizing
   - Error handling and recovery
   - Personalized/Non-personalized ads support

5. **Privacy and Security**:

   - GDPR-compliant data handling
   - App Tracking Transparency implementation
   - Optional biometric authentication
   - Secure data storage

6. **User Experience**:

   - Custom splash screen with configurable duration
   - Keyboard handling and resizing
   - Screen orientation support
   - Keep awake functionality for tracking
   - In-app review integration

7. **Internationalization**:
   - Multi-language support with `i18next`
   - Currently supported languages:
     - English
     - German
   - Localized interface elements
   - RTL support

### Technical Specifications

1. **Frontend Stack**:

   - React
   - TypeScript
   - Mantine UI Framework
   - React Router for navigation

2. **Mobile Framework**:

   - Capacitor
   - Native plugins for platform-specific features
   - SQLite for data persistence

3. **Development Tools**:

   - ESLint for code quality
   - Prettier for code formatting
   - Webpack for bundling
   - TypeScript for type safety

4. **Testing and Quality**:
   - Unit testing setup
   - E2E testing capabilities
   - Code quality checks
   - Performance monitoring

### Configuration

1. **Capacitor Configuration** (`capacitor.config.ts`):

   ```typescript
   {
     appId: 'de.mini-genie.feedandsleep',
     appName: 'Feed and Sleep',
     plugins: {
       AdMob: {
         appId: 'ca-app-pub-3385049365741222~1441830408',
         autoShow: true,
         requestTrackingAuthorization: true
       },
       // ... other plugin configs
     }
   }
   ```

2. **Database Configuration**:

   - iOS/Android: Auto-configured paths
   - Optional encryption
   - Biometric auth support

3. **Build Configuration**:
   - Webpack optimization
   - Asset management
   - Environment-specific settings

### Development Workflow

1. **Local Development**:

   ```console
   npm start           # Start dev server
   npm run build      # Build for production
   npm run lint       # Run linter
   npm run format     # Format code
   ```

2. **Mobile Development**:
   ```console
   npx cap sync       # Sync web code to mobile
   npx cap open ios   # Open iOS project
   npx cap open android # Open Android project
   ```

### Deployment

1. **iOS App Store**:

   - Requires Apple Developer account
   - Follow App Store guidelines
   - Submit through App Store Connect

2. **Google Play Store**:
   - Requires Google Play Developer account
   - Follow Play Store guidelines
   - Submit through Play Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
