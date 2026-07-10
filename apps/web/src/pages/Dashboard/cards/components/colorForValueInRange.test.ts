import { describe, expect, it } from 'vitest'
import { colorForValueInRange, INDICATOR_LIGHTNESS, INDICATOR_SATURATION } from './colorForValueInRange'

const hsl = (deg: number) => `hsl(${deg}deg ${INDICATOR_SATURATION}% ${INDICATOR_LIGHTNESS}%)`

describe('colorForValueInRange', () => {
  it('returns green at the optimal value', () => {
    expect(colorForValueInRange(21, { optimal: 21, lowest: 15, highest: 30 })).toBe(hsl(120))
  })

  it('returns red above the highest value', () => {
    expect(colorForValueInRange(35, { optimal: 21, lowest: 15, highest: 30 })).toBe(hsl(0))
  })

  it('returns blue above the highest value when reversed', () => {
    expect(colorForValueInRange(65, { optimal: 45, lowest: 20, highest: 60, reverse: true })).toBe(hsl(240))
  })

  it('returns red below the lowest value when reversed', () => {
    expect(colorForValueInRange(10, { optimal: 45, lowest: 20, highest: 60, reverse: true })).toBe(hsl(0))
  })

  it('returns inherit when no range is configured', () => {
    expect(colorForValueInRange(42, {})).toBe('inherit')
  })

  it('interpolates hue between optimal and highest', () => {
    expect(colorForValueInRange(25, { optimal: 20, lowest: 10, highest: 30 })).toBe(hsl(60))
  })
})
