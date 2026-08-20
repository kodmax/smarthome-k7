import {
  APP_LOCALES,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  getTranslations,
  type AppLocale,
  type Translations,
} from '@repo/i18n'
import { createI18n } from './createI18n'

export const { I18nProvider, useLocale, useTranslations, isLocale } = createI18n<AppLocale, Translations>({
  storageKey: LOCALE_STORAGE_KEY,
  cookieKey: LOCALE_COOKIE_KEY,
  locales: APP_LOCALES,
  fallbackLocale: 'pl',
  getTranslations,
})

export {
  APP_LOCALES,
  LOCALE_COOKIE_KEY,
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  getTranslations,
  isAppLocale,
  resolveAppLocale,
  type AppLocale,
  type Translations,
} from '@repo/i18n'
