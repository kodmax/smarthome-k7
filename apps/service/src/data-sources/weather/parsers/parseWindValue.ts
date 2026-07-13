export const parseWindValue = (wind: string): { direction: string; speed: number; speedUnit: string } => {
  const [direction, speed, speedUnit] = wind.split(' ')
  if (direction === undefined || speed === undefined || speedUnit === undefined) {
    throw new Error(`malformed wind detail value "${wind}"`)
  }

  return {
    direction,
    speed: Number(speed),
    speedUnit,
  }
}
