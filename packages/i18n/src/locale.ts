export const LOCALE_STORAGE_KEY = 'smarthome-locale'

/** Cookie used by Next.js SSR (and synced from the client on locale change). */
export const LOCALE_COOKIE_KEY = 'lang'

export type AppLocale = 'en' | 'pl' | 'ru'

export const APP_LOCALES: AppLocale[] = ['en', 'pl', 'ru']

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: 'English',
  pl: 'Polski',
  ru: 'Русский',
}

export const isAppLocale = (value: string | null | undefined): value is AppLocale =>
  value === 'en' || value === 'pl' || value === 'ru'

export const resolveAppLocale = (value: string | null | undefined, fallback: AppLocale = 'pl'): AppLocale =>
  isAppLocale(value) ? value : fallback
