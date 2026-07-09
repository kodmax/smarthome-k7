import { describe, expect, it } from 'vitest'
import { toMetersPerSecond } from './windSpeed'

describe('toMetersPerSecond', () => {
  it('converts km/h to m/s', () => {
    expect(toMetersPerSecond(18, 'km/h')).toBe(5)
    expect(toMetersPerSecond(36, 'km/h')).toBe(10)
  })

  it('returns speed unchanged for m/s', () => {
    expect(toMetersPerSecond(7, 'm/s')).toBe(7)
  })
})
