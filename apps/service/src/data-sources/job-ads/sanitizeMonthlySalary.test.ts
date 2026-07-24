import { describe, expect, it } from 'vitest'
import { getMonthlySalaryAfterTax } from './getMonthlySalaryAfterTax'
import { MIN_PLAUSIBLE_MONTHLY_NET, sanitizeMonthlySalaryRange } from './sanitizeMonthlySalary'

describe('sanitizeMonthlySalaryRange', () => {
  it('keeps range when from is at least minimum net monthly', () => {
    expect(sanitizeMonthlySalaryRange({ from: MIN_PLAUSIBLE_MONTHLY_NET, to: 6_000 })).toEqual({
      from: MIN_PLAUSIBLE_MONTHLY_NET,
      to: 6_000,
    })
  })

  it('drops range when from is below minimum even if to is above', () => {
    expect(sanitizeMonthlySalaryRange({ from: 4_500, to: 6_000 })).toBeUndefined()
    expect(sanitizeMonthlySalaryRange({ from: 4_000, to: 4_999 })).toBeUndefined()
  })

  it('drops Ness-like Day b2b net mislabel (115–125 PLN/day)', () => {
    const range = getMonthlySalaryAfterTax('b2b', 'Day', 115, 125)
    expect(range.from).toBeLessThan(MIN_PLAUSIBLE_MONTHLY_NET)
    expect(sanitizeMonthlySalaryRange(range)).toBeUndefined()
  })

  it('drops Awareson-like Day b2b net mislabel (110–160 PLN/day)', () => {
    const range = getMonthlySalaryAfterTax('b2b', 'Day', 110, 160)
    expect(range.from).toBeLessThan(MIN_PLAUSIBLE_MONTHLY_NET)
    expect(sanitizeMonthlySalaryRange(range)).toBeUndefined()
  })

  it('drops Netguru-like permanent gross Hour (30 PLN/h)', () => {
    const range = getMonthlySalaryAfterTax('permanent', 'Hour', 30, 30)
    expect(range.from).toBeLessThan(MIN_PLAUSIBLE_MONTHLY_NET)
    expect(sanitizeMonthlySalaryRange(range)).toBeUndefined()
  })

  it('keeps monday.com-like permanent gross Month range', () => {
    const range = getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000)
    expect(sanitizeMonthlySalaryRange(range)).toEqual({ from: 30_000, to: 40_200 })
  })
})
