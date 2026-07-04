import { describe, expect, it } from 'vitest'
import { getAbsoluteHumidity } from './absoluteHumidity'

describe('getAbsoluteHumidity', () => {
  it('returns a positive value for typical indoor conditions', () => {
    expect(getAbsoluteHumidity(20, 50)).toBeCloseTo(8.67, 1)
  })

  it('increases with relative humidity at the same temperature', () => {
    expect(getAbsoluteHumidity(20, 70)).toBeGreaterThan(getAbsoluteHumidity(20, 40))
  })
})
