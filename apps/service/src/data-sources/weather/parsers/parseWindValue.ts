const windSpeedUnitPattern = /^(km\/h|m\/s|mph)$/i

export const parseWindValue = (wind: string): { direction: string; speed: number; speedUnit: string } => {
  const parts = wind.split(' ')

  if (parts.length === 3) {
    const [direction, speed, speedUnit] = parts
    if (direction === undefined || speed === undefined || speedUnit === undefined) {
      throw new Error(`malformed wind detail value "${wind}"`)
    }

    return {
      direction,
      speed: Number(speed),
      speedUnit,
    }
  }

  if (parts.length === 2) {
    const [speed, speedUnit] = parts
    if (speed === undefined || speedUnit === undefined || !windSpeedUnitPattern.test(speedUnit)) {
      throw new Error(`malformed wind detail value "${wind}"`)
    }

    return {
      direction: '',
      speed: Number(speed),
      speedUnit,
    }
  }

  throw new Error(`malformed wind detail value "${wind}"`)
}
