import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'

export type Locale = 'fr' | 'en'

export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en']
export const DEFAULT_LOCALE: Locale = 'fr'

const savedLocale = localStorage.getItem('locale') as Locale | null
const browserLocale = navigator.language.slice(0, 2) as Locale
const initialLocale: Locale =
  savedLocale && SUPPORTED_LOCALES.includes(savedLocale)
    ? savedLocale
    : SUPPORTED_LOCALES.includes(browserLocale)
      ? browserLocale
      : DEFAULT_LOCALE

const i18n = createI18n({
  legacy: false,              // Composition API mode
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { fr, en },
  datetimeFormats: {
    fr: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    },
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    },
  },
})

export default i18n
