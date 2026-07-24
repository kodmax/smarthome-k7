import { describe, expect, it } from 'vitest'
import { calendarDaysBetween, formatAppliedDaysAgo } from './formatAppliedDaysAgo'

describe('formatAppliedDaysAgo', () => {
  const now = new Date('2026-07-19T15:30:00')

  it('returns locale-specific not-applicable labels when appliedAt is null', () => {
    expect(formatAppliedDaysAgo(null, 'pl', now)).toBe('n/d')
    expect(formatAppliedDaysAgo(null, 'en', now)).toBe('n/a')
    expect(formatAppliedDaysAgo(null, 'ru', now)).toBe('н/п')
  })

  it('formats same-day, yesterday, and older applications in Polish', () => {
    expect(formatAppliedDaysAgo('2026-07-19T08:00:00', 'pl', now)).toBe('dziś')
    expect(formatAppliedDaysAgo('2026-07-18T08:00:00', 'pl', now)).toBe('wczoraj')
    expect(formatAppliedDaysAgo('2026-07-17T08:00:00', 'pl', now)).toBe('2 dni temu')
    expect(formatAppliedDaysAgo('2026-07-16T08:00:00', 'pl', now)).toBe('3 dni temu')
    expect(formatAppliedDaysAgo('2026-07-15T08:00:00', 'pl', now)).toBe('4 dni temu')
    expect(formatAppliedDaysAgo('2026-07-14T08:00:00', 'pl', now)).toBe('5 dni temu')
    expect(formatAppliedDaysAgo('2026-07-01T08:00:00', 'pl', now)).toBe('18 dni temu')
  })

  it('counts calendar days between dates', () => {
    const from = new Date('2026-07-17T23:59:00')
    const to = new Date('2026-07-19T00:01:00')

    expect(calendarDaysBetween(from, to)).toBe(2)
  })
})
