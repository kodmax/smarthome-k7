import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computeMedianSalary } from './computeMedianSalary'

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

describe('computeMedianSalary', () => {
  it('returns null when no ads have salary ranges', () => {
    expect(computeMedianSalary([makeAd(), makeAd()])).toBeNull()
  })

  it('computes the median of salary range upper bounds', () => {
    expect(
      computeMedianSalary([
        makeAd({ from: 20_000, to: 24_000 }),
        makeAd({ from: 26_000, to: 30_000 }),
        makeAd({ from: 28_000, to: 32_000 }),
      ]),
    ).toBe(30_000)
  })

  it('ignores ads without salary ranges', () => {
    expect(computeMedianSalary([makeAd(), makeAd({ from: 20_000, to: 24_000 })])).toBe(24_000)
  })
})
