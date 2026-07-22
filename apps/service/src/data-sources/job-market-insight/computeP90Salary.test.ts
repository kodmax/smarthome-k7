import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computeP90Salary, countP90Offers } from './computeP90Salary'

const makeAd = (salary?: { from: number; to: number }): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: [],
  workplaceType: 'remote',
  employmentType: 'permanent',
  publishedAt: '2026-01-01T00:00:00.000Z',
  monthlySalaryRangeAfterTaxes: salary,
})

describe('computeP90Salary', () => {
  it('returns zero when no ads have salary ranges', () => {
    expect(computeP90Salary([makeAd(), makeAd()])).toBe(0)
  })

  it('computes P90 from salary range upper bounds', () => {
    expect(
      computeP90Salary([
        makeAd({ from: 10_000, to: 12_000 }),
        makeAd({ from: 15_000, to: 18_000 }),
        makeAd({ from: 20_000, to: 24_000 }),
        makeAd({ from: 26_000, to: 30_000 }),
        makeAd({ from: 28_000, to: 32_000 }),
        makeAd({ from: 30_000, to: 34_000 }),
        makeAd({ from: 32_000, to: 36_000 }),
        makeAd({ from: 34_000, to: 38_000 }),
        makeAd({ from: 36_000, to: 40_000 }),
        makeAd({ from: 38_000, to: 42_000 }),
      ]),
    ).toBe(40_000)
  })

  it('treats ads without salary as below any salary range when computing P90', () => {
    const salaryAds = [
      makeAd({ from: 10_000, to: 12_000 }),
      makeAd({ from: 15_000, to: 18_000 }),
      makeAd({ from: 20_000, to: 24_000 }),
      makeAd({ from: 26_000, to: 30_000 }),
      makeAd({ from: 28_000, to: 32_000 }),
      makeAd({ from: 30_000, to: 34_000 }),
      makeAd({ from: 32_000, to: 36_000 }),
      makeAd({ from: 34_000, to: 38_000 }),
      makeAd({ from: 36_000, to: 40_000 }),
      makeAd({ from: 38_000, to: 42_000 }),
    ]

    expect(computeP90Salary(salaryAds)).toBe(40_000)
    expect(computeP90Salary([...salaryAds, ...Array.from({ length: 20 }, () => makeAd())])).toBe(36_000)
  })
})

describe('countP90Offers', () => {
  it('returns zero when no ads have salary ranges', () => {
    expect(countP90Offers([makeAd(), makeAd()])).toBe(0)
  })

  it('counts ads at or above the P90 salary range upper bound', () => {
    expect(
      countP90Offers([
        makeAd({ from: 10_000, to: 12_000 }),
        makeAd({ from: 15_000, to: 18_000 }),
        makeAd({ from: 20_000, to: 24_000 }),
        makeAd({ from: 26_000, to: 30_000 }),
        makeAd({ from: 28_000, to: 32_000 }),
        makeAd({ from: 30_000, to: 34_000 }),
        makeAd({ from: 32_000, to: 36_000 }),
        makeAd({ from: 34_000, to: 38_000 }),
        makeAd({ from: 36_000, to: 40_000 }),
        makeAd({ from: 38_000, to: 42_000 }),
      ]),
    ).toBe(2)
  })
})
