export const beaufortScale = (speedKmh: number): number => {
  const knots = speedKmh / 1.852
  const bScale = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64]

  for (let i = 0; i < bScale.length; i++) {
    if (knots < bScale[i]) {
      return i
    }
  }

  return bScale.length
}

export const beaufortScaleFromMetersPerSecond = (speedMs: number): number => beaufortScale(speedMs * 3.6)

export const beaufortLevelLabel = (level: number, labels: readonly string[]): string => labels[level] ?? ''
