import { ContractType } from '@repo/types'
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

    it('raises net when paid vacation days are set', () => {
      const withoutVacation = getMonthlySalaryAfterTax('b2b', 'Month', 30_000, 30_000)
      const withTwentyDays = getMonthlySalaryAfterTax('b2b', 'Month', 30_000, 30_000, 20)

      expect(withoutVacation).toEqual({ from: 22_665, to: 22_665 })
      expect(withTwentyDays).toEqual({ from: 24_714, to: 24_714 })
      expect(withTwentyDays.from).toBeGreaterThan(withoutVacation.from)
    })

    it('ignores paid vacation days for permanent contracts', () => {
      expect(getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000, 20)).toEqual(
        getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000),
      )
    })
  })

  describe('uod-like contract types', () => {
    it('converts uod without zus deduction', () => {
      expect(getMonthlySalaryAfterTax('uod', 'Month', 20_000, 25_000)).toEqual({
        from: Math.round((((20_000 * 12) / 2008) * 1800 * 0.88) / 12),
        to: Math.round((((25_000 * 12) / 2008) * 1800 * 0.88) / 12),
      })
    })

    it('converts mandate_contract like uod', () => {
      expect(getMonthlySalaryAfterTax('mandate_contract', 'Month', 20_000, 25_000)).toEqual(
        getMonthlySalaryAfterTax('uod', 'Month', 20_000, 25_000),
      )
    })

    it('converts contract like uod', () => {
      expect(getMonthlySalaryAfterTax('contract', 'Month', 8_000, 13_000)).toEqual(
        getMonthlySalaryAfterTax('uod', 'Month', 8_000, 13_000),
      )
    })
  })

  describe('other jj contract types', () => {
    it('converts any like b2b', () => {
      expect(getMonthlySalaryAfterTax('any', 'Hour', 100, 120)).toEqual(
        getMonthlySalaryAfterTax('b2b', 'Hour', 100, 120),
      )
    })

    it('converts internship like permanent', () => {
      expect(getMonthlySalaryAfterTax('internship', 'Month', 50_000, 67_000)).toEqual(
        getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000),
      )
    })

    it('converts intern like permanent', () => {
      expect(getMonthlySalaryAfterTax('intern', 'Month', 50_000, 67_000)).toEqual(
        getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000),
      )
    })
  })

  it('throws for unknown contract type', () => {
    expect(() => getMonthlySalaryAfterTax('invalid' as ContractType, 'Month', 10_000, 12_000)).toThrow(
      'Unknown contract type: invalid',
    )
  })
})
