import { describe, expect, it } from 'vitest'
import { resolveMonthlySalaryFromOriginal } from './resolveJobAdSalary'

describe('resolveMonthlySalaryFromOriginal', () => {
  const nbpRates = {
    USD: 4,
    EUR: 4.3,
    GBP: 5,
  }

  it('converts USD original salary to monthly PLN net', () => {
    const monthly = resolveMonthlySalaryFromOriginal(
      {
        from: 120_000,
        to: 160_000,
        period: 'Year',
        currency: 'USD',
      },
      nbpRates,
    )

    expect(monthly).toBeDefined()
    expect(monthly!.from).toBeGreaterThan(0)
    expect(monthly!.to).toBeGreaterThan(monthly!.from)
  })

  it('returns undefined when originalSalary is missing', () => {
    expect(resolveMonthlySalaryFromOriginal(undefined, nbpRates)).toBeUndefined()
  })
})
