import { describe, expect, it } from 'vitest'
import { calculateCost } from './calculate-cost'

describe('calculateCost', () => {
  it('calculates energy cost from consumption', () => {
    // distribution (0.16036) + energy (0.5376) = 0.69796 per kWh
    expect(calculateCost(100)).toBe('69.80')
  })

  it('returns zero for zero consumption', () => {
    expect(calculateCost(0)).toBe('0.00')
  })

  it('rounds to two decimal places', () => {
    expect(calculateCost(1)).toBe('0.70')
  })
})
