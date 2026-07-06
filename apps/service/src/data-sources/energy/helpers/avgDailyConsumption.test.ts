import { describe, expect, it } from 'vitest'
import { avgDailyConsumption } from './avgDailyConsumption'
import type { HourlyReading } from './types'

const reading = (datetime: string, hour_start_reading: number): HourlyReading => ({
  datetime,
  hour_start_reading,
})

describe('avgDailyConsumption', () => {
  it('calculates average from production-like readings over 30 days', () => {
    const start = reading('2026-06-06T00:00:00Z', 17_137_917)
    const end = reading('2026-07-06T00:00:00Z', 17_399_885)

    expect(avgDailyConsumption(start, end)).toBeCloseTo(8732.27, 1)
  })

  it('propagates invalid date range errors', () => {
    const sameDay = reading('2026-07-06T00:00:00Z', 100)

    expect(() => avgDailyConsumption(sameDay, sameDay)).toThrow('Invalid reading date range for average consumption')
  })
})
