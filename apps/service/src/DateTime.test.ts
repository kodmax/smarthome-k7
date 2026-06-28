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
    expect(new DateTime().getDate()).toBe('2025-06-28')
  })

  it('getTime returns HH:MM:SS', () => {
    expect(new DateTime().getTime()).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('getDateTime combines date and time', () => {
    const dt = new DateTime()
    expect(dt.getDateTime()).toBe(`${dt.getDate()}T${dt.getTime()}`)
  })

  it('shifts back by hours', () => {
    const dt = new DateTime(-2, CacheAgeUnit.HOURS)
    const expected = new Date(
      fixedNow.getTime() - fixedNow.getTimezoneOffset() * 60000 - 2 * CacheAgeUnit.HOURS * 1000,
    )
      .toISOString()
      .substring(0, 10)

    expect(dt.getDate()).toBe(expected)
  })

  it('shifts back by days', () => {
    const dt = new DateTime(-7, CacheAgeUnit.DAYS)
    const expected = new Date(
      fixedNow.getTime() - fixedNow.getTimezoneOffset() * 60000 - 7 * CacheAgeUnit.DAYS * 1000,
    )
      .toISOString()
      .substring(0, 10)

    expect(dt.getDate()).toBe(expected)
  })
})
