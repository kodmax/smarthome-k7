import type { AppLocale } from '@/i18n/locale'

export function calendarDaysBetween(from: Date, to: Date): number {
  const startFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const startTo = new Date(to.getFullYear(), to.getMonth(), to.getDate())

  return Math.floor((startTo.getTime() - startFrom.getTime()) / (24 * 60 * 60 * 1000))
}

export function isPublishedToday(publishedAt: string, now = new Date()): boolean {
  return calendarDaysBetween(new Date(publishedAt), now) === 0
}

function formatDaysAgo(locale: AppLocale, days: number): string {
  switch (locale) {
    case 'pl':
      return days === 1 ? '1 dzień temu' : `${days} dni temu`
    case 'ru':
      return formatRussianDaysAgo(days)
    default:
      return days === 1 ? '1 day ago' : `${days} days ago`
  }
}

function formatRussianDaysAgo(days: number): string {
  const lastDigit = days % 10
  const lastTwoDigits = days % 100

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${days} день назад`
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${days} дня назад`
  }

  return `${days} дней назад`
}

export const NOT_APPLICABLE_LABEL: Record<AppLocale, string> = {
  pl: 'n/d',
  en: 'n/a',
  ru: 'н/п',
}

const APPLIED_NOT_AVAILABLE = NOT_APPLICABLE_LABEL

const APPLIED_TODAY: Record<AppLocale, string> = {
  pl: 'dziś',
  en: 'today',
  ru: 'сегодня',
}

const APPLIED_YESTERDAY: Record<AppLocale, string> = {
  pl: 'wczoraj',
  en: 'yesterday',
  ru: 'вчера',
}

export function formatNotApplicable(locale: AppLocale): string {
  return NOT_APPLICABLE_LABEL[locale]
}

export function formatAppliedDaysAgo(appliedAt: string | null, locale: AppLocale, now = new Date()): string {
  if (appliedAt === null) {
    return APPLIED_NOT_AVAILABLE[locale]
  }

  const appliedDate = new Date(appliedAt)
  const days = calendarDaysBetween(appliedDate, now)

  if (days <= 0) {
    return APPLIED_TODAY[locale]
  }

  if (days === 1) {
    return APPLIED_YESTERDAY[locale]
  }

  return formatDaysAgo(locale, days)
}

export function formatAppliedDaysShort(appliedAt: string | null, now = new Date()): string | null {
  if (appliedAt === null) {
    return null
  }

  const days = calendarDaysBetween(new Date(appliedAt), now)

  return `${Math.max(days, 0)}d`
}
