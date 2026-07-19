const windDirectionCodes = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const

export const windDirectionAngle = (direction: string): number => {
  const index = windDirectionCodes.indexOf(direction as (typeof windDirectionCodes)[number])
  return index === -1 ? 0 : index * 22.5
}
