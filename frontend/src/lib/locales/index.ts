import ptBR from "./pt-BR";
import enUS from "./en-US";

export const defaultMessages = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

export const defaultAvailableLocales = [
  { code: "pt-BR", name: "Português (Brasil)", countryCode: "BR" },
  { code: "en-US", name: "English (US)", countryCode: "US" },
] as const;

export type LocaleCode = string;

export const defaultLocale: LocaleCode = "pt-BR";

export type LocaleOption = {
  code: string;
  name: string;
  countryCode: string;
};
