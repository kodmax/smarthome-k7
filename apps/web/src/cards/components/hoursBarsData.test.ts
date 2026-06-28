import { describe, expect, it } from 'vitest'
import { buildHoursBarHeights, toHoursBarDataPoints } from './hoursBarsData'

describe('toHoursBarDataPoints', () => {
  it('parses string hours using the first two characters', () => {
    expect(toHoursBarDataPoints([{ hour: '14:30', value: 10 }], 'value')).toEqual([{ hour: 14, value: 10 }])
  })
})

describe('buildHoursBarHeights', () => {
  it('scales positive values against positiveMax', () => {
    const bars = buildHoursBarHeights([{ hour: 12, value: 15 }], 30, 30)

    expect(bars[12]).toBe(50)
    expect(bars[0]).toBeUndefined()
  })

  it('scales negative values against negativeMax', () => {
    const bars = buildHoursBarHeights([{ hour: 8, value: -20 }], 30, 40)

    expect(bars[8]).toBe(-50)
  })
})
