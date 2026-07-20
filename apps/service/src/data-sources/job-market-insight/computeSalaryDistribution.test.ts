import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { classifySalaryUpperBound, computeSalaryDistribution } from './computeSalaryDistribution'

const makeAd = (salary?: { from: number; to: number }): JobAd => ({
  id: String(salary?.from ?? 'none'),
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

describe('classifySalaryUpperBound', () => {
  it('uses upper salary bounds with half-open bucket ranges', () => {
    expect(classifySalaryUpperBound(4_999)).toBe('below5k')
    expect(classifySalaryUpperBound(5_000)).toBe('from5to10k')
    expect(classifySalaryUpperBound(9_999)).toBe('from5to10k')
    expect(classifySalaryUpperBound(10_000)).toBe('from10to15k')
    expect(classifySalaryUpperBound(29_999)).toBe('from25to30k')
    expect(classifySalaryUpperBound(30_000)).toBe('from30to35k')
    expect(classifySalaryUpperBound(35_000)).toBe('from35to40k')
    expect(classifySalaryUpperBound(40_000)).toBe('above40k')
    expect(classifySalaryUpperBound(40_001)).toBe('above40k')
  })

  it('classifies offers by the top of their salary range', () => {
    expect(computeSalaryDistribution([makeAd({ from: 25_000, to: 30_000 })])[2]).toEqual({
      id: 'from30to35k',
      percentage: 100,
    })
    expect(computeSalaryDistribution([makeAd({ from: 30_000, to: 35_000 })])[1]).toEqual({
      id: 'from35to40k',
      percentage: 100,
    })
  })
})

describe('computeSalaryDistribution', () => {
  it('returns zeroed brackets for an empty list', () => {
    expect(computeSalaryDistribution([])).toEqual([
      { id: 'above40k', percentage: 0 },
      { id: 'from35to40k', percentage: 0 },
      { id: 'from30to35k', percentage: 0 },
      { id: 'from25to30k', percentage: 0 },
      { id: 'from20to25k', percentage: 0 },
      { id: 'from15to20k', percentage: 0 },
      { id: 'from10to15k', percentage: 0 },
      { id: 'from5to10k', percentage: 0 },
      { id: 'below5k', percentage: 0 },
    ])
  })

  it('ignores ads without salary ranges and percentages are relative to ads with salary', () => {
    expect(
      computeSalaryDistribution([
        makeAd({ from: 4_000, to: 4_500 }),
        makeAd({ from: 8_000, to: 9_000 }),
        makeAd({ from: 11_000, to: 13_000 }),
        makeAd({ from: 16_000, to: 18_000 }),
        makeAd({ from: 22_000, to: 26_000 }),
        makeAd({ from: 27_000, to: 31_000 }),
        makeAd({ from: 32_000, to: 36_000 }),
        makeAd({ from: 36_000, to: 39_000 }),
        makeAd({ from: 41_000, to: 45_000 }),
        makeAd(),
      ]),
    ).toEqual([
      { id: 'above40k', percentage: 11 },
      { id: 'from35to40k', percentage: 22 },
      { id: 'from30to35k', percentage: 11 },
      { id: 'from25to30k', percentage: 11 },
      { id: 'from20to25k', percentage: 0 },
      { id: 'from15to20k', percentage: 11 },
      { id: 'from10to15k', percentage: 11 },
      { id: 'from5to10k', percentage: 11 },
      { id: 'below5k', percentage: 11 },
    ])
  })
})
