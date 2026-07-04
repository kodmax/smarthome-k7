const bScale = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64]

export const beaufortScale = (speed: number): number => {
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

export const beaufortLevelLabel = (level: number): string => {
  return bsLabels[level]
}
