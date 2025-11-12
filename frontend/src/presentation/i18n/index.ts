import { createI18n } from 'vue-i18n';
import enUS from './locales/en-US';
import ptBR from './locales/pt-BR';

export type MessageSchema = typeof enUS;

export const i18n = createI18n<[MessageSchema], 'en-US' | 'pt-BR'>({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'pt-BR': ptBR
  }
});

export const availableLocales = [
  { code: 'pt-BR', name: 'Português (Brasil)', countryCode: 'BR' },
  { code: 'en-US', name: 'English (US)', countryCode: 'US' }
] as const;

export default i18n;
