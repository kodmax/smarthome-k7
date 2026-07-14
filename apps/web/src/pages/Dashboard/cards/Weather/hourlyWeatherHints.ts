import type { HourWeatherForecast, PrecipType } from '@repo/types'
import {
  FROST_MAX_C,
  HIGH_UV_MIN,
  HOURLY_LOOKAHEAD,
  HOT_OUTDOOR_MIN_C,
  PRECIP_CHANCE_MIN_PERCENT,
  STRONG_WIND_MIN_MS,
} from '@/app/hints/hintShowThresholds'
import { type PrecipHintType, PRECIP_HINT_TYPES } from './precipTypeIcons'

const parsePrecipPercent = (precip: string): number => Number.parseFloat(precip.replace('%', '').trim())

const hasHourlyPrecipChance = (hour: HourWeatherForecast): boolean =>
  parsePrecipPercent(hour.precip) >= PRECIP_CHANCE_MIN_PERCENT

export const nextHours = (hourly: HourWeatherForecast[] | undefined): HourWeatherForecast[] =>
  hourly?.slice(0, HOURLY_LOOKAHEAD) ?? []

export const shouldShowHourlyPrecipHint = (
  hourly: HourWeatherForecast[] | undefined,
  precipType: PrecipHintType,
): boolean => nextHours(hourly).some(hour => hour.precipType === precipType && hasHourlyPrecipChance(hour))

export const shouldShowHourlyRainHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  shouldShowHourlyPrecipHint(hourly, 'rain')

export const shouldShowHourlySnowHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  shouldShowHourlyPrecipHint(hourly, 'snow')

export const shouldShowHourlyHailHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  shouldShowHourlyPrecipHint(hourly, 'hail')

export const shouldShowHourlySleetHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  shouldShowHourlyPrecipHint(hourly, 'sleet')

export const shouldShowHourlyIceHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  shouldShowHourlyPrecipHint(hourly, 'ice')

export const shouldShowHourlyMixedHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  shouldShowHourlyPrecipHint(hourly, 'mixed')

export const shouldShowAnyHourlyPrecipHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  PRECIP_HINT_TYPES.some(precipType => shouldShowHourlyPrecipHint(hourly, precipType))

export const shouldShowHourlyHotHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => Number(hour.temp) >= HOT_OUTDOOR_MIN_C)

export const shouldShowHourlyWindHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => hour.wind.speed >= STRONG_WIND_MIN_MS)

export const shouldShowHourlyHighUvHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => hour.uv >= HIGH_UV_MIN)

export const shouldShowHourlyFrostHint = (hourly: HourWeatherForecast[] | undefined): boolean =>
  nextHours(hourly).some(hour => Number(hour.temp) <= FROST_MAX_C)

export const maxHourlyPrecipPercentForType = (
  hourly: HourWeatherForecast[] | undefined,
  precipType: Exclude<PrecipType, 'none'>,
): number =>
  Math.max(
    0,
    ...nextHours(hourly)
      .filter(hour => hour.precipType === precipType)
      .map(hour => parsePrecipPercent(hour.precip)),
  )

export const maxHourlyPrecipPercent = (hourly: HourWeatherForecast[] | undefined): number =>
  Math.max(0, ...PRECIP_HINT_TYPES.map(precipType => maxHourlyPrecipPercentForType(hourly, precipType)))

export const maxHourlyTemp = (hourly: HourWeatherForecast[] | undefined): number =>
  Math.max(0, ...nextHours(hourly).map(hour => Number(hour.temp)))

export const maxHourlyWindSpeed = (hourly: HourWeatherForecast[] | undefined): number =>
  Math.max(0, ...nextHours(hourly).map(hour => hour.wind.speed))

export const maxHourlyUv = (hourly: HourWeatherForecast[] | undefined): number =>
  Math.max(0, ...nextHours(hourly).map(hour => hour.uv))

export const minHourlyTemp = (hourly: HourWeatherForecast[] | undefined): number => {
  const temps = nextHours(hourly).map(hour => Number(hour.temp))

  return temps.length === 0 ? Number.POSITIVE_INFINITY : Math.min(...temps)
}
