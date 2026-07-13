export const STRONG_WIND_MIN_MS = 6
export const HOT_OUTDOOR_MIN_C = 28
export const HIGH_UV_MIN = 7

export const shouldShowStrongWindHint = (windSpeedMs: number): boolean => windSpeedMs >= STRONG_WIND_MIN_MS

export const shouldShowHotOutdoorHint = (tempC: number | undefined): boolean =>
  tempC !== undefined && tempC >= HOT_OUTDOOR_MIN_C

export const shouldShowHighUvHint = (uv: number | undefined): boolean => uv !== undefined && uv >= HIGH_UV_MIN
