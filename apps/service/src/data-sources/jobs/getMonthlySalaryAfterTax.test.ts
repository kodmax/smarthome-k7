import { describe, expect, it } from 'vitest'
import { getMonthlySalaryAfterTax } from './getMonthlySalaryAfterTax'

describe('getMonthlySalaryAfterTax', () => {
  describe('permanent', () => {
    it('converts monthly gross to monthly net', () => {
      expect(getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000)).toEqual({
        from: 30_000,
        to: 40_200,
      })
    })

    it('converts hourly gross to monthly net', () => {
      expect(getMonthlySalaryAfterTax('permanent', 'Hour', 100, 120)).toEqual({
        from: Math.round((100 * 2008 * 0.6) / 12),
        to: Math.round((120 * 2008 * 0.6) / 12),
      })
    })

    it('converts daily gross to monthly net', () => {
      expect(getMonthlySalaryAfterTax('permanent', 'Day', 800, 1000)).toEqual({
        from: Math.round((800 * 251 * 0.6) / 12),
        to: Math.round((1000 * 251 * 0.6) / 12),
      })
    })

    it('converts yearly gross to monthly net', () => {
      expect(getMonthlySalaryAfterTax('permanent', 'Year', 600_000, 800_000)).toEqual({
        from: Math.round((600_000 * 0.6) / 12),
        to: Math.round((800_000 * 0.6) / 12),
      })
    })
  })

  describe('b2b', () => {
    it('converts monthly rate to monthly net', () => {
      expect(getMonthlySalaryAfterTax('b2b', 'Month', 20_000, 25_000)).toEqual({
        from: Math.round((((20_000 * 12) / 2008) * 1800 * 0.88 - 12_000) / 12),
        to: Math.round((((25_000 * 12) / 2008) * 1800 * 0.88 - 12_000) / 12),
      })
    })

    it('converts hourly rate to monthly net', () => {
      expect(getMonthlySalaryAfterTax('b2b', 'Hour', 100, 120)).toEqual({
        from: Math.round((((100 * 2008) / 2008) * 1800 * 0.88 - 12_000) / 12),
        to: Math.round((((120 * 2008) / 2008) * 1800 * 0.88 - 12_000) / 12),
      })
    })
  })
})
