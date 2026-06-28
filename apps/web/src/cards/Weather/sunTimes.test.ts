import { type WeatherFeed } from '@repo/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sunTimes } from './sunTimes'

function weatherFeed(dawn: string, dusk: string): WeatherFeed {
  return {
    sunTimes: { dawn, dusk, sunrise: dawn, sunset: dusk },
  } as WeatherFeed
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString().substring(0, 5)
}

describe('sunTimes', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns night and dawn time before sunrise', () => {
    vi.setSystemTime(new Date('2026-06-28T03:00:00'))
    const dawn = '2026-06-28T04:30:00'
    const dusk = '2026-06-28T21:00:00'

    expect(sunTimes(weatherFeed(dawn, dusk))).toEqual({
      timeOfDay: 'night',
      time: formatTime(dawn),
    })
  })

  it('returns day and dusk time between dawn and dusk', () => {
    vi.setSystemTime(new Date('2026-06-28T12:00:00'))
    const dawn = '2026-06-28T04:30:00'
    const dusk = '2026-06-28T21:00:00'

    expect(sunTimes(weatherFeed(dawn, dusk))).toEqual({
      timeOfDay: 'day',
      time: formatTime(dusk),
    })
  })

  it('returns night and next dawn time after dusk', () => {
    vi.setSystemTime(new Date('2026-06-28T23:00:00'))
    const dawn = '2026-06-28T04:30:00'
    const dusk = '2026-06-28T21:00:00'

    expect(sunTimes(weatherFeed(dawn, dusk))).toEqual({
      timeOfDay: 'night',
      time: formatTime(dawn),
    })
  })
})
