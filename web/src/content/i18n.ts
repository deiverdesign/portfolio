export const LOCALES = ["en", "pt"] as const;
export const DEFAULT_LOCALE = "en" as const;

export type Locale = (typeof LOCALES)[number];
export type Localized<T> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
