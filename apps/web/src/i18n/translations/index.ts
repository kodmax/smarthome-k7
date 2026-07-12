import { type AppLocale } from '../locale'
import { en } from './en'
import { pl } from './pl'
import { ru } from './ru'
import { type Translations } from './types'

export const translations: Record<AppLocale, Translations> = {
  en,
  pl,
  ru,
}

export const getTranslations = (locale: AppLocale): Translations => translations[locale]
