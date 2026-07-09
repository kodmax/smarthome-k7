import { describe, expect, it } from 'vitest'
import { chooseColor, INDICATOR_LIGHTNESS, INDICATOR_SATURATION } from './chooseColor'

const hsl = (deg: number) => `hsl(${deg}deg ${INDICATOR_SATURATION}% ${INDICATOR_LIGHTNESS}%)`

describe('chooseColor', () => {
  it('returns green at the optimal value', () => {
    expect(chooseColor(21, { optimal: 21, lowest: 15, highest: 30 })).toBe(hsl(120))
  })

  it('returns red above the highest value', () => {
    expect(chooseColor(35, { optimal: 21, lowest: 15, highest: 30 })).toBe(hsl(0))
  })

  it('returns blue above the highest value when reversed', () => {
    expect(chooseColor(65, { optimal: 45, lowest: 20, highest: 60, reverse: true })).toBe(hsl(240))
  })

  it('returns red below the lowest value when reversed', () => {
    expect(chooseColor(10, { optimal: 45, lowest: 20, highest: 60, reverse: true })).toBe(hsl(0))
  })

  it('returns inherit when no range is configured', () => {
    expect(chooseColor(42, {})).toBe('inherit')
  })

  it('interpolates hue between optimal and highest', () => {
    expect(chooseColor(25, { optimal: 20, lowest: 10, highest: 30 })).toBe(hsl(60))
  })
})
