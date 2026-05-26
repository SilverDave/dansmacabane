import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/i18n'
import { SUPPORTED_LOCALES } from '@/i18n'

export function useLocale() {
  const { locale, t } = useI18n()

  const currentLocale = computed(() => locale.value as Locale)

  function setLocale(lang: Locale) {
    locale.value = lang
    localStorage.setItem('locale', lang)
    document.documentElement.setAttribute('lang', lang)
  }

  function toggleLocale() {
    const next = SUPPORTED_LOCALES.find(l => l !== locale.value) ?? 'fr'
    setLocale(next)
  }

  return {
    currentLocale,
    supportedLocales: SUPPORTED_LOCALES,
    setLocale,
    toggleLocale,
    t,
  }
}
