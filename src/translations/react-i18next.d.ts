import translations from './index';

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: (typeof translations)['en-GB'];
  }
}

export type TLanguage =
  | 'de'
  | 'en'
  | 'es'
  | 'ru'
  | 'uk'
  | 'pl'
  | 'fr'
  | 'nl'
  | 'pt'
  | 'tr'
  | 'zh'
  | 'ja';
