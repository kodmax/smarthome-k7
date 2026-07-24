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

  it('formats monthly salary in thousands', () => {
    expect(
      formatJobSalary({
        monthlySalaryRangeAfterTaxes: { from: 15_400, to: 22_600 },
      }),
    ).toEqual({
      monthlySalaryFrom: 15,
      monthlySalaryTo: 23,
      b2bHourlyRateEquivalent: Math.round((22_600 / 0.88 + 1000) / 150),
    })
  })
})
