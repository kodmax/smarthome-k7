import type { AppLocale } from '@/i18n/locale'

const LOCALE_TAGS: Record<AppLocale, string> = {
  en: 'en-GB',
  pl: 'pl-PL',
  ru: 'ru-RU',
}

export function formatCvModifiedDate(modifiedAt: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(modifiedAt))
}

export function formatCvModifiedTime(modifiedAt: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(modifiedAt))
}
