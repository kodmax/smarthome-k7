import { describe, expect, it } from 'vitest'
import { toMetersPerSecond } from './toMetersPerSecond'

describe('toMetersPerSecond', () => {
  it('converts km/h to m/s', () => {
    expect(toMetersPerSecond(18, 'km/h')).toBe(5)
    expect(toMetersPerSecond(12, 'km/h')).toBeCloseTo(12 / 3.6)
  })

  it('throws on unexpected unit', () => {
    expect(() => toMetersPerSecond(18, 'm/s')).toThrow('unexpected wind speed unit "m/s", expected "km/h"')
  })
})
