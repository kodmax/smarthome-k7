export const BEDROOM_HOT_MIN_C = 28

export const shouldShowHotBedroomHint = (tempC: number | undefined): boolean =>
  tempC !== undefined && tempC >= BEDROOM_HOT_MIN_C
