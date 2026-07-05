import { ColorIndicationRange } from './ColorIndication'

/** Oryginalnie 100% — obniżone, żeby kolory lepiej leżały na ciemnym tle kafelków */
export const INDICATOR_SATURATION = 80

/** Oryginalnie 50% */
export const INDICATOR_LIGHTNESS = 60

const hsl = (deg: number): string => `hsl(${deg}deg ${INDICATOR_SATURATION}% ${INDICATOR_LIGHTNESS}%)`

export function chooseColor(instant: number, { lowest, optimal, highest, reverse }: ColorIndicationRange): string {
  if (optimal !== undefined) {
    if (instant > optimal && highest !== undefined) {
      return instant > highest
        ? hsl(reverse ? 240 : 0)
        : hsl(120 - ((instant - optimal) / (highest - optimal)) * (reverse ? -120 : 120))
    } else if (instant < optimal && lowest !== undefined) {
      return instant < lowest
        ? hsl(reverse ? 0 : 240)
        : hsl(120 + ((optimal - instant) / (optimal - lowest)) * (reverse ? -120 : 120))
    } else {
      return hsl(120)
    }
  } else {
    return 'inherit'
  }
}
