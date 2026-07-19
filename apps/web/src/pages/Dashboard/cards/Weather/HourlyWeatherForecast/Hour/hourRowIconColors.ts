import { CALM_WIND_MAX_MS, HIGH_UV_MIN, LOW_PRECIP_CHANCE_PERCENT, LOW_UV_MAX } from '@/app/hints/hintShowThresholds'
import { shouldShowStrongWindHint } from '../../weatherHints'

const MUTED_ICON_COLOR = 'var(--mui-palette-text-secondary)'
const ERROR_ICON_COLOR = 'var(--mui-palette-error-main)'
const AIR_ICON_COLOR = 'var(--mui-palette-air-main)'

export const mutedIconColor = MUTED_ICON_COLOR

const parsePrecipPercent = (precip: string): number => Number.parseFloat(precip.replace('%', '').trim())

export const sunIconColor = (uv: number): string | undefined => {
  if (uv <= LOW_UV_MAX) return MUTED_ICON_COLOR
  if (uv >= HIGH_UV_MIN) return ERROR_ICON_COLOR
  return undefined
}

export const windIconColor = (speedMs: number): string => {
  if (speedMs <= CALM_WIND_MAX_MS) return MUTED_ICON_COLOR
  if (shouldShowStrongWindHint(speedMs)) return ERROR_ICON_COLOR
  return AIR_ICON_COLOR
}

export const precipIconColor = (precip: string): string | undefined => {
  if (parsePrecipPercent(precip) < LOW_PRECIP_CHANCE_PERCENT) return MUTED_ICON_COLOR
  return undefined
}

export const parseHourlyPrecipPercent = parsePrecipPercent
