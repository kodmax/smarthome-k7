import { describe, expect, it } from 'vitest'
import { formatJobSalary } from './formatJobSalary'

describe('formatJobSalary', () => {
  it('returns nulls when salary range is missing', () => {
    expect(formatJobSalary({})).toEqual({
      monthlySalaryFrom: null,
      monthlySalaryTo: null,
      b2bHourlyRateEquivalent: null,
    })
  })

  it('formats monthly salary in thousands and reads take-home hourly rate from content', () => {
    expect(
      formatJobSalary({
        monthlySalaryRangeAfterTaxes: { from: 15_400, to: 22_600 },
        takeHomeHourlyRate: 172,
      }),
    ).toEqual({
      monthlySalaryFrom: 15,
      monthlySalaryTo: 23,
      b2bHourlyRateEquivalent: 172,
    })
  })

  it('returns null hourly rate when takeHomeHourlyRate is missing', () => {
    expect(
      formatJobSalary({
        monthlySalaryRangeAfterTaxes: { from: 22_600, to: 22_600 },
      }).b2bHourlyRateEquivalent,
    ).toBeNull()
  })
})
