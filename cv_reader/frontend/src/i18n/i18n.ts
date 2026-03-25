import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import _ from 'lodash';
import { initReactI18next } from 'react-i18next';

export const nt = _.identity;

export const DEFAULT_LOCALE = 'en';

const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : DEFAULT_LOCALE;
const initialLng = browserLang || DEFAULT_LOCALE;

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

declare global {
  interface Window {
    i18n: typeof i18n;
  }
}

void i18n
  .use(
    resourcesToBackend((language, namespace, callback) => {
      import(`./locales/${language}/translation.json`)
        .then(resource => callback(null, resource.default || resource))
        .catch(error => callback(error, null));
    }),
  )
  .use(initReactI18next)
  .init({
    returnNull: false,
    lng: initialLng,
    interpolation: {
      escapeValue: false,
    },
    keySeparator: false,
    nsSeparator: false,
  });

window.i18n = i18n;

export default i18n;
