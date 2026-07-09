import { type WeatherFeed } from '@repo/types'

const defaultInstant: WeatherFeed['instant'] = {
  clouds: { coverage: '20', height: '1000' },
  wind: {
    angle: 180,
    maxSpeed: 36,
    speedUnit: 'km/h',
    direction: 'S',
    speed: 18,
  },
  humidity: 55,
  pressure: 1013,
  temp: 22,
  uv: 5,
}

export function weatherFeed(overrides?: Partial<WeatherFeed>): WeatherFeed {
  return {
    outdoorTemp: overrides?.outdoorTemp ?? [{ hour: 12, value: '22' }],
    instant: {
      ...defaultInstant,
      ...overrides?.instant,
      wind: {
        ...defaultInstant.wind,
        ...overrides?.instant?.wind,
      },
    },
    sunTimes: {
      dawn: '2026-06-28T03:30:00',
      sunrise: '2026-06-28T04:00:00',
      sunset: '2026-06-28T20:30:00',
      dusk: '2026-06-28T21:00:00',
      ...overrides?.sunTimes,
    },
    pressure: { week: [], instant: 1013, ...overrides?.pressure },
    allergens: overrides?.allergens ?? [],
    forecast: overrides?.forecast ?? [],
    hourly: overrides?.hourly ?? [],
    aq: overrides?.aq ?? { aqi: 2, pollutants: {} },
  }
}
