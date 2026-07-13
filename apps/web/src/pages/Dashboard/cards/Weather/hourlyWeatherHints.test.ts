import { describe, expect, it } from 'vitest'
import type { HourWeatherForecast } from '@repo/types'
import { shouldShowHourlyHotHint, shouldShowHourlyRainHint, shouldShowHourlyWindHint } from './hourlyWeatherHints'

const hour = (overrides: Partial<HourWeatherForecast>): HourWeatherForecast => ({
  precipIcon: 'rain.svg',
  precip: '10%',
  temp: '22',
  icon: '1.svg',
  hour: '12',
  date: '2026-07-13',
  sun: { altitude: 45, azimuth: 180 },
  wind: { direction: 'NE', speed: 3 },
  ...overrides,
})

describe('shouldShowHourlyRainHint', () => {
  it('shows hint when at least one of the next 3 hours has 51% precipitation chance', () => {
    expect(
      shouldShowHourlyRainHint([
        hour({ precip: '30%' }),
        hour({ precip: '51%' }),
        hour({ precip: '10%' }),
        hour({ precip: '80%' }),
      ]),
    ).toBe(true)
  })

  it('ignores hours beyond the next 3', () => {
    expect(
      shouldShowHourlyRainHint([
        hour({ precip: '10%' }),
        hour({ precip: '10%' }),
        hour({ precip: '10%' }),
        hour({ precip: '90%' }),
      ]),
    ).toBe(false)
  })

  it('hides hint when precipitation stays below 51%', () => {
    expect(shouldShowHourlyRainHint([hour({ precip: '50%' }), hour({ precip: '20%' })])).toBe(false)
  })
})

describe('shouldShowHourlyHotHint', () => {
  it('shows hint when at least one of the next 3 hours reaches 28°C', () => {
    expect(
      shouldShowHourlyHotHint([hour({ temp: '24' }), hour({ temp: '28' }), hour({ temp: '22' }), hour({ temp: '35' })]),
    ).toBe(true)
  })

  it('hides hint when all next hours stay below 28°C', () => {
    expect(shouldShowHourlyHotHint([hour({ temp: '27' }), hour({ temp: '26' })])).toBe(false)
  })
})

describe('shouldShowHourlyWindHint', () => {
  it('shows hint when at least one of the next 3 hours reaches 6 m/s', () => {
    expect(
      shouldShowHourlyWindHint([
        hour({ wind: { direction: 'NE', speed: 3 } }),
        hour({ wind: { direction: 'NE', speed: 6 } }),
        hour({ wind: { direction: 'NE', speed: 2 } }),
        hour({ wind: { direction: 'NE', speed: 10 } }),
      ]),
    ).toBe(true)
  })

  it('ignores hours beyond the next 3', () => {
    expect(
      shouldShowHourlyWindHint([
        hour({ wind: { direction: 'NE', speed: 3 } }),
        hour({ wind: { direction: 'NE', speed: 3 } }),
        hour({ wind: { direction: 'NE', speed: 3 } }),
        hour({ wind: { direction: 'NE', speed: 8 } }),
      ]),
    ).toBe(false)
  })

  it('hides hint when wind stays below 6 m/s', () => {
    expect(
      shouldShowHourlyWindHint([
        hour({ wind: { direction: 'NE', speed: 5.9 } }),
        hour({ wind: { direction: 'NE', speed: 2 } }),
      ]),
    ).toBe(false)
  })
})
