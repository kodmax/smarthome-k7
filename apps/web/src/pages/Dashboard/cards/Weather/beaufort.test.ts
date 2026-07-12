import { describe, expect, it } from 'vitest'
import { pl } from '@/i18n/translations/pl'
import { beaufortLevelLabel, beaufortScale } from './beaufort'

const beaufortLabels = pl.dashboard.weather.beaufortScale

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
    expect(beaufortLevelLabel(0, beaufortLabels)).toBe('Cisza, flauta')
    expect(beaufortLevelLabel(12, beaufortLabels)).toBe('Huragan')
  })
})
