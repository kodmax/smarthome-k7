import type { PrecipType } from '@repo/types'

/** AccuWeather weather icon codes: https://developer.accuweather.com/documentation/weather-icons */
const RAIN_ICONS = new Set([12, 13, 14, 18, 39, 40])
const HAIL_ICONS = new Set([15, 16, 17, 41, 42])
const SNOW_ICONS = new Set([19, 20, 21, 22, 23, 43, 44])
const MIXED_ICONS = new Set([29])
const SLEET_ICONS = new Set([25])
const ICE_ICONS = new Set([24, 26])

export const parseWeatherIconCode = (weatherIcon: string): number => {
  const code = Number.parseInt(weatherIcon.replace(/\.svg$/i, ''), 10)
  if (Number.isNaN(code)) {
    throw new Error(`malformed weather icon "${weatherIcon}"`)
  }

  return code
}

export const parsePrecipType = (weatherIcon: string): PrecipType => {
  const code = parseWeatherIconCode(weatherIcon)

  if (HAIL_ICONS.has(code)) {
    return 'hail'
  }

  if (SLEET_ICONS.has(code)) {
    return 'sleet'
  }

  if (ICE_ICONS.has(code)) {
    return 'ice'
  }

  if (MIXED_ICONS.has(code)) {
    return 'mixed'
  }

  if (SNOW_ICONS.has(code)) {
    return 'snow'
  }

  if (RAIN_ICONS.has(code)) {
    return 'rain'
  }

  return 'none'
}
