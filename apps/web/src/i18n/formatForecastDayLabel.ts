import type { Translations } from './translations/types'

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const toLocalDateKey = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const isSameLocalDay = (a: Date, b: Date): boolean => toLocalDateKey(a) === toLocalDateKey(b)

export const parseForecastDate = (ddMm: string, reference = new Date()): Date => {
  const [day, month] = ddMm.split('.').map(Number)
  const refYear = reference.getFullYear()
  let candidate = new Date(refYear, month - 1, day)

  const diffDays = (candidate.getTime() - reference.getTime()) / 86400000
  if (diffDays < -180) {
    candidate = new Date(refYear + 1, month - 1, day)
  } else if (diffDays > 180) {
    candidate = new Date(refYear - 1, month - 1, day)
  }

  return candidate
}

export const mondayBasedWeekdayIndex = (date: Date): number => {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export const parseIsoDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const formatIsoWeekdayShort = (isoDate: string, t: Translations): string => {
  return t.dateTime.weekdayShort[mondayBasedWeekdayIndex(parseIsoDate(isoDate))]
}

export const formatForecastDayLabel = (ddMm: string, t: Translations): string => {
  const date = parseForecastDate(ddMm)
  const today = new Date()

  if (isSameLocalDay(date, today)) return t.dateTime.todayShort
  if (isSameLocalDay(date, addDays(today, 1))) return t.dateTime.tomorrowShort

  return t.dateTime.weekdayShort[mondayBasedWeekdayIndex(date)]
}
