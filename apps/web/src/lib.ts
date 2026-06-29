import { type ColorIndicationRange } from '@/card-components'

export function getAbsoluteHumidity(temp: number, relativeHumidity: number): number {
  return Number(
    216.7 * (((relativeHumidity / 100) * 6.112 * Math.exp((17.62 * temp) / (243.12 + temp))) / (273.15 + temp)),
  )
}

export const optimalHumidityRange = {
  optimal: 45,
  highest: 60,
  lowest: 20,
  reverse: true,
} satisfies ColorIndicationRange

const bScale = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64]
export const beaufortScale: (speed: number) => number = speed => {
  const knots = speed / 1.852

  for (let i = 0; i < bScale.length; i++) {
    if (knots < bScale[i]) {
      return i
    }
  }

  return bScale.length
}

const bsLabels = [
  'Cisza, flauta',
  'Powiew',
  'Słaby wiatr',
  'Łagodny wiatr',
  'Umiarkowany wiatr',
  'Dość silny wiatr',
  'Silny wiatr',
  'Bardzo silny wiatr',
  'Sztorm, wicher',
  'Silny sztorm',
  'Bardzo silny sztorm',
  'Gwałtowny sztorm',
  'Huragan',
]

export const beaufortLevelLabel: (level: number) => string = level => {
  return bsLabels[level]
}
