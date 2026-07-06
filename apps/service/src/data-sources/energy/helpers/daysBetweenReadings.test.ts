import { describe, expect, it } from 'vitest'
import { daysBetweenReadings } from './daysBetweenReadings'
import type { HourlyReading } from './types'

const reading = (datetime: string, hour_start_reading = 0): HourlyReading => ({
  datetime,
  hour_start_reading,
})

describe('daysBetweenReadings', () => {
  it('returns 30 days between month boundaries', () => {
    expect(daysBetweenReadings(reading('2026-06-06T00:00:00Z'), reading('2026-07-06T00:00:00Z'))).toBe(30)
  })

  it('returns 91 days for a longer window', () => {
    expect(daysBetweenReadings(reading('2026-04-06T00:00:00Z'), reading('2026-07-06T00:00:00Z'))).toBe(91)
  })

  it('throws when end is not after start', () => {
    const sameDay = reading('2026-07-06T00:00:00Z')

    expect(() => daysBetweenReadings(sameDay, sameDay)).toThrow('Invalid reading date range for average consumption')
    expect(() => daysBetweenReadings(reading('2026-07-06T00:00:00Z'), reading('2026-06-06T00:00:00Z'))).toThrow(
      'Invalid reading date range for average consumption',
    )
  })
})
