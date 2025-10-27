import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'
import ptBR from './locales/pt-BR'

export type MessageSchema = typeof enUS

const i18n = createI18n<[MessageSchema], 'en-US' | 'pt-BR'>({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'pt-BR': ptBR
  }
})

export default i18n
