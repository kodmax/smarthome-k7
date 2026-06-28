import { describe, expect, it } from 'vitest'
import { beaufortLevelLabel, beaufortScale, getAbsoluteHumidity } from './lib'

describe('getAbsoluteHumidity', () => {
  it('returns a positive value for typical indoor conditions', () => {
    expect(getAbsoluteHumidity(20, 50)).toBeCloseTo(8.67, 1)
  })

  it('increases with relative humidity at the same temperature', () => {
    expect(getAbsoluteHumidity(20, 70)).toBeGreaterThan(getAbsoluteHumidity(20, 40))
  })
})

describe('beaufortScale', () => {
  it('returns 0 for calm wind', () => {
    expect(beaufortScale(0)).toBe(0)
  })

  it('maps 1 knot to Beaufort 1', () => {
    expect(beaufortScale(1.852)).toBe(1)
  })

  it('returns the top level for hurricane-force wind', () => {
    expect(beaufortScale(200)).toBe(12)
  })
})

describe('beaufortLevelLabel', () => {
  it('returns the Polish label for a known level', () => {
    expect(beaufortLevelLabel(0)).toBe('Cisza, flauta')
    expect(beaufortLevelLabel(12)).toBe('Huragan')
  })
})
