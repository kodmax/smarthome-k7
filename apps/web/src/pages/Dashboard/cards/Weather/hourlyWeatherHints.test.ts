import { describe, expect, it } from 'vitest'
import type { HourWeatherForecast } from '@repo/types'
import {
  maxHourlyPrecipPercentForType,
  shouldShowHourlyFrostHint,
  shouldShowHourlyHailHint,
  shouldShowHourlyHighUvHint,
  shouldShowHourlyHotHint,
  shouldShowHourlyIceHint,
  shouldShowHourlyMixedHint,
  shouldShowHourlyRainHint,
  shouldShowHourlySleetHint,
  shouldShowHourlySnowHint,
  shouldShowHourlyWindHint,
} from './hourlyWeatherHints'

const hour = (overrides: Partial<HourWeatherForecast>): HourWeatherForecast => ({
  precipType: 'none',
  precip: '10%',
  temp: '22',
  icon: '1.svg',
  hour: '12',
  date: '2026-07-13',
  sun: { altitude: 45, azimuth: 180 },
  wind: { direction: 'NE', speed: 3 },
  uv: 0,
  ...overrides,
})

describe('shouldShowHourlyRainHint', () => {
  it('shows hint when at least one of the next 3 hours has 51% rain precipitation chance', () => {
    expect(
      shouldShowHourlyRainHint([
        hour({ precip: '30%', precipType: 'rain' }),
        hour({ precip: '51%', precipType: 'rain' }),
        hour({ precip: '10%', precipType: 'rain' }),
        hour({ precip: '80%', precipType: 'rain' }),
      ]),
    ).toBe(true)
  })

  it('ignores hours beyond the next 3', () => {
    expect(
      shouldShowHourlyRainHint([
        hour({ precip: '10%', precipType: 'rain' }),
        hour({ precip: '10%', precipType: 'rain' }),
        hour({ precip: '10%', precipType: 'rain' }),
        hour({ precip: '90%', precipType: 'rain' }),
      ]),
    ).toBe(false)
  })

  it('hides hint when precipitation stays below 51%', () => {
    expect(shouldShowHourlyRainHint([hour({ precip: '50%', precipType: 'rain' }), hour({ precip: '20%' })])).toBe(false)
  })

  it('hides hint when precipitation chance is high but type is not rain', () => {
    expect(shouldShowHourlyRainHint([hour({ precip: '80%', precipType: 'snow' })])).toBe(false)
  })
})

describe('shouldShowHourlySnowHint', () => {
  it('shows hint for snow hours with at least 51% precipitation chance', () => {
    expect(shouldShowHourlySnowHint([hour({ precip: '55%', precipType: 'snow' })])).toBe(true)
  })

  it('hides hint for snow hours below 51%', () => {
    expect(shouldShowHourlySnowHint([hour({ precip: '50%', precipType: 'snow' })])).toBe(false)
  })
})

describe('shouldShowHourlyHailHint', () => {
  it('shows hint for hail hours with at least 51% precipitation chance', () => {
    expect(shouldShowHourlyHailHint([hour({ precip: '60%', precipType: 'hail' })])).toBe(true)
  })
})

describe('shouldShowHourlySleetHint', () => {
  it('shows hint for sleet hours with at least 51% precipitation chance', () => {
    expect(shouldShowHourlySleetHint([hour({ precip: '70%', precipType: 'sleet' })])).toBe(true)
  })
})

describe('shouldShowHourlyIceHint', () => {
  it('shows hint for ice hours with at least 51% precipitation chance', () => {
    expect(shouldShowHourlyIceHint([hour({ precip: '65%', precipType: 'ice' })])).toBe(true)
  })
})

describe('shouldShowHourlyMixedHint', () => {
  it('shows hint for mixed hours with at least 51% precipitation chance', () => {
    expect(shouldShowHourlyMixedHint([hour({ precip: '75%', precipType: 'mixed' })])).toBe(true)
  })
})

describe('maxHourlyPrecipPercentForType', () => {
  it('returns the highest precipitation chance for the given type in the next 3 hours', () => {
    expect(
      maxHourlyPrecipPercentForType(
        [
          hour({ precip: '30%', precipType: 'snow' }),
          hour({ precip: '55%', precipType: 'snow' }),
          hour({ precip: '40%', precipType: 'rain' }),
          hour({ precip: '90%', precipType: 'snow' }),
        ],
        'snow',
      ),
    ).toBe(55)
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

describe('shouldShowHourlyHighUvHint', () => {
  it('shows hint when at least one of the next 3 hours reaches UV 7', () => {
    expect(shouldShowHourlyHighUvHint([hour({ uv: 2 }), hour({ uv: 7 }), hour({ uv: 1 }), hour({ uv: 9 })])).toBe(true)
  })

  it('hides hint when UV stays below 7', () => {
    expect(shouldShowHourlyHighUvHint([hour({ uv: 6.9 }), hour({ uv: 2 })])).toBe(false)
  })
})

describe('shouldShowHourlyFrostHint', () => {
  it('shows hint when at least one of the next 3 hours reaches 0°C or below', () => {
    expect(
      shouldShowHourlyFrostHint([hour({ temp: '2' }), hour({ temp: '0' }), hour({ temp: '4' }), hour({ temp: '-3' })]),
    ).toBe(true)
  })

  it('ignores hours beyond the next 3', () => {
    expect(
      shouldShowHourlyFrostHint([hour({ temp: '2' }), hour({ temp: '3' }), hour({ temp: '4' }), hour({ temp: '-1' })]),
    ).toBe(false)
  })

  it('hides hint when all next hours stay above 0°C', () => {
    expect(shouldShowHourlyFrostHint([hour({ temp: '1' }), hour({ temp: '5' })])).toBe(false)
  })
})
