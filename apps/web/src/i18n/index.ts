import { APP_LOCALES, LOCALE_STORAGE_KEY, getTranslations, type AppLocale, type Translations } from '@repo/i18n'
import { createI18n } from './createI18n'

export const { I18nProvider, useLocale, useTranslations } = createI18n<AppLocale, Translations>({
  storageKey: LOCALE_STORAGE_KEY,
  locales: APP_LOCALES,
  fallbackLocale: 'pl',
  getTranslations,
})

export {
  APP_LOCALES,
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  formatForecastDayLabel,
  formatIsoWeekdayLong,
  formatIsoWeekdayShort,
  mondayBasedWeekdayIndex,
  parseForecastDate,
  parseIsoDate,
  type AppLocale,
  type Translations,
} from '@repo/i18n'
