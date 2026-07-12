import { createI18n } from '@repo/i18n-react'
import { APP_LOCALES, LOCALE_STORAGE_KEY, type AppLocale } from './locale'
import { getTranslations } from './translations'
import type { Translations } from './translations/types'

export const { I18nProvider, useLocale, useTranslations } = createI18n<AppLocale, Translations>({
  storageKey: LOCALE_STORAGE_KEY,
  locales: APP_LOCALES,
  fallbackLocale: 'pl',
  getTranslations,
})

export { APP_LOCALES, LOCALE_LABELS, LOCALE_STORAGE_KEY, type AppLocale } from './locale'
export type { Translations } from './translations/types'
export {
  formatForecastDayLabel,
  formatIsoWeekdayShort,
  mondayBasedWeekdayIndex,
  parseForecastDate,
  parseIsoDate,
} from './formatForecastDayLabel'
