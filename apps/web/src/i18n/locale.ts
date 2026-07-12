export const LOCALE_STORAGE_KEY = 'smarthome-locale'

export type AppLocale = 'en' | 'pl' | 'ru'

export const APP_LOCALES: AppLocale[] = ['en', 'pl', 'ru']

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: 'English',
  pl: 'Polski',
  ru: 'Русский',
}
