import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computeOffersWithSalaryRangePercent } from './computeOffersWithSalaryRangePercent'

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

describe('computeOffersWithSalaryRangePercent', () => {
  it('returns 0 for an empty list', () => {
    expect(computeOffersWithSalaryRangePercent([])).toBe(0)
  })

  it('returns the rounded share of ads with salary ranges', () => {
    expect(
      computeOffersWithSalaryRangePercent([
        makeAd({ from: 20_000, to: 24_000 }),
        makeAd({ from: 26_000, to: 30_000 }),
        makeAd(),
        makeAd(),
      ]),
    ).toBe(50)
  })
})
