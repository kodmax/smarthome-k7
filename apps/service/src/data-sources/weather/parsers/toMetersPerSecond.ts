export const ACCU_WEATHER_WIND_SPEED_UNIT = 'km/h'

export const toMetersPerSecond = (speed: number, speedUnit: string): number => {
  if (speedUnit !== ACCU_WEATHER_WIND_SPEED_UNIT) {
    throw new Error(`unexpected wind speed unit "${speedUnit}", expected "${ACCU_WEATHER_WIND_SPEED_UNIT}"`)
  }

  return speed / 3.6
}
