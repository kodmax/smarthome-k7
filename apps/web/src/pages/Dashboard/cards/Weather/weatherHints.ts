import { FROST_MAX_C, HIGH_UV_MIN, HOT_OUTDOOR_MIN_C, STRONG_WIND_MIN_MS } from '@/app/hints/hintShowThresholds'

export const shouldShowStrongWindHint = (windSpeedMs: number): boolean => windSpeedMs >= STRONG_WIND_MIN_MS

export const shouldShowHotOutdoorHint = (tempC: number | undefined): boolean =>
  tempC !== undefined && tempC >= HOT_OUTDOOR_MIN_C

export const shouldShowHighUvHint = (uv: number | undefined): boolean => uv !== undefined && uv >= HIGH_UV_MIN

export const shouldShowFrostHint = (tempC: number | undefined): boolean => tempC !== undefined && tempC <= FROST_MAX_C
