export function toMetersPerSecond(speed: number, speedUnit: string): number {
  return speedUnit === 'km/h' ? Math.round(speed / 3.6) : speed
}
