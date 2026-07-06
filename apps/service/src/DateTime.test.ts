import { CacheAgeUnit } from '@repo/apollo-ws'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DateTime from './DateTime'

describe('DateTime', () => {
  const fixedNow = new Date('2025-06-28T14:30:45.123Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('getDate returns YYYY-MM-DD', () => {
    expect(DateTime.now().getDate()).toBe('2025-06-28')
  })

  it('getTime returns HH:MM:SS', () => {
    expect(DateTime.now().getTime()).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('getDateTime combines date and time', () => {
    const dt = DateTime.now()
    expect(dt.getDateTime()).toBe(`${dt.getDate()}T${dt.getTime()}`)
  })

  it('shifts back by hours', () => {
    const dt = DateTime.shift(-2, CacheAgeUnit.HOURS)
    const expected = new Date(fixedNow.getTime() - fixedNow.getTimezoneOffset() * 60000 - 2 * CacheAgeUnit.HOURS * 1000)
      .toISOString()
      .substring(0, 10)

    expect(dt.getDate()).toBe(expected)
  })

  it('shifts back by days', () => {
    const dt = DateTime.shift(-7, CacheAgeUnit.DAYS)
    const expected = new Date(fixedNow.getTime() - fixedNow.getTimezoneOffset() * 60000 - 7 * CacheAgeUnit.DAYS * 1000)
      .toISOString()
      .substring(0, 10)

    expect(dt.getDate()).toBe(expected)
  })

  it('shifted shifts back by hours from existing datetime', () => {
    const base = DateTime.now()
    const dt = base.shifted(-2, CacheAgeUnit.HOURS)
    const expected = new Date(fixedNow.getTime() - fixedNow.getTimezoneOffset() * 60000 - 2 * CacheAgeUnit.HOURS * 1000)
      .toISOString()
      .substring(0, 10)

    expect(dt.getDate()).toBe(expected)
  })

  it('shifted shifts back by days from existing datetime', () => {
    const base = DateTime.shift(-3, CacheAgeUnit.DAYS)
    const dt = base.shifted(-7, CacheAgeUnit.DAYS)
    const expected = new Date(fixedNow.getTime() - fixedNow.getTimezoneOffset() * 60000 - 10 * CacheAgeUnit.DAYS * 1000)
      .toISOString()
      .substring(0, 10)

    expect(dt.getDate()).toBe(expected)
  })

  it('shifted does not mutate original instance', () => {
    const base = DateTime.now()
    const originalDateTime = base.getDateTime()

    base.shifted(-5, CacheAgeUnit.HOURS)

    expect(base.getDateTime()).toBe(originalDateTime)
  })
})
