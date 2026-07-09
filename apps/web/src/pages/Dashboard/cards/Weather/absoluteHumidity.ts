export function getAbsoluteHumidity(temp: number, relativeHumidity: number): number {
  return Number(
    216.7 * (((relativeHumidity / 100) * 6.112 * Math.exp((17.62 * temp) / (243.12 + temp))) / (273.15 + temp)),
  )
}
