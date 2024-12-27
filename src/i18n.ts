import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translations from './translations/index';
console.debug('test in i18n');
console.log('test in i18n log');
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      debug: false,
      fallbackLng: 'en-GB',
      resources: {
        ...translations,
      },
      ns: 'translations',
      keySeparator: false,
      pluralSeparator: '_',
    },
    () => {
      document.documentElement.setAttribute('lang', i18n.language);
    },
  );

i18n.on('languageChanged', (language) => {
  document.documentElement.setAttribute('lang', language);
});

export default i18n;
