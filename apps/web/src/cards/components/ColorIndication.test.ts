import { describe, expect, it } from 'vitest'
import { chooseColor } from './ColorIndication'

describe('chooseColor', () => {
  it('returns green at the optimal value', () => {
    expect(chooseColor(21, { optimal: 21, lowest: 15, highest: 30 })).toBe('hsl(120deg 100% 50%')
  })

  it('returns red above the highest value', () => {
    expect(chooseColor(35, { optimal: 21, lowest: 15, highest: 30 })).toBe('hsl(0deg 100% 50%')
  })

  it('returns blue above the highest value when reversed', () => {
    expect(chooseColor(65, { optimal: 45, lowest: 20, highest: 60, reverse: true })).toBe('hsl(240deg 100% 50%')
  })

  it('returns red below the lowest value when reversed', () => {
    expect(chooseColor(10, { optimal: 45, lowest: 20, highest: 60, reverse: true })).toBe('hsl(0deg 100% 50%')
  })

  it('uses below threshold mode', () => {
    expect(chooseColor(5, { below: 10 })).toBe('hsl(120deg 100% 50%')
    expect(chooseColor(15, { below: 10 })).toBe('hsl(0deg 100% 50%')
  })

  it('returns inherit when no range is configured', () => {
    expect(chooseColor(42, {})).toBe('inherit')
  })
})
