import type { HourWeatherForecast } from '@repo/types'
import { HOT_OUTDOOR_MIN_C, STRONG_WIND_MIN_MS } from './weatherHints'

export const HOURLY_LOOKAHEAD = 3
export const PRECIP_CHANCE_MIN_PERCENT = 51

const parsePrecipPercent = (precip: string): number => Number.parseFloat(precip.replace('%', '').trim())

export const nextHours = (hourly: HourWeatherForecast[] | undefined): HourWeatherForecast[] =>
  hourly?.slice(0, HOURLY_LOOKAHEAD) ?? []

export const shouldShowHourlyRainHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => parsePrecipPercent(hour.precip) >= PRECIP_CHANCE_MIN_PERCENT)

export const shouldShowHourlyHotHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => Number(hour.temp) >= HOT_OUTDOOR_MIN_C)

export const shouldShowHourlyWindHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => hour.wind.speed >= STRONG_WIND_MIN_MS)
