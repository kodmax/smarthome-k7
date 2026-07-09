import { describe, expect, it } from 'vitest'
import { buildHoursBarHeights, toHoursBarDataPoints } from './hoursBarsData'

describe('toHoursBarDataPoints', () => {
  it('parses string hours using the first two characters', () => {
    expect(toHoursBarDataPoints([{ hour: '14:30', value: 10 }], 'value')).toEqual([{ hour: 14, value: 10 }])
  })
})

describe('buildHoursBarHeights', () => {
  it('scales values between lowest and highest', () => {
    const bars = buildHoursBarHeights([{ hour: 12, value: 15 }], 30)

    expect(bars[12]).toBe(50)
    expect(bars[0]).toBeUndefined()
  })

  it('uses a custom lowest bound instead of zero', () => {
    const bars = buildHoursBarHeights([{ hour: 12, value: 25 }], 30, 20)

    expect(bars[12]).toBe(50)
  })

  it('scales negative values against lowest', () => {
    const bars = buildHoursBarHeights([{ hour: 8, value: -20 }], 30, -40)

    expect(bars[8]).toBeCloseTo(28.571, 2)
  })

  it('clamps values below lowest to zero height', () => {
    const bars = buildHoursBarHeights([{ hour: 6, value: 14 }], 30, 15)

    expect(bars[6]).toBe(0)
  })

  it('clamps values above highest to full height', () => {
    const bars = buildHoursBarHeights([{ hour: 18, value: 35 }], 30, 15)

    expect(bars[18]).toBe(100)
  })
})
