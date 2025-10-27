import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale, t } = useI18n()

  const setLocale = (newLocale: 'pt-BR' | 'en-US') => {
    locale.value = newLocale
    localStorage.setItem('invoicemanager:locale', newLocale)
  }

  const toggleLocale = () => {
    const newLocale = locale.value === 'pt-BR' ? 'en-US' : 'pt-BR'
    setLocale(newLocale)
  }

  const currentLocale = () => locale.value

  const isPortuguese = () => locale.value === 'pt-BR'

  const isEnglish = () => locale.value === 'en-US'

  return {
    locale,
    t,
    setLocale,
    toggleLocale,
    currentLocale,
    isPortuguese,
    isEnglish
  }
}
