import { describe, expect, it } from 'vitest'
import { JobAd } from '@repo/types'
import { computeJobsSalaryRange } from './computeJobsSalaryRange'

const baseAd = (salary?: JobAd['monthlySalaryRangeAfterTaxes']): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: ['React'],
  workplaceType: 'remote',
  employmentType: 'permanent',
  monthlySalaryRangeAfterTaxes: salary,
  publishedAt: '2026-01-01T00:00:00.000Z',
})

describe('computeJobsSalaryRange', () => {
  it('returns null when no ads have salary', () => {
    expect(computeJobsSalaryRange([baseAd(), baseAd(undefined)])).toBeNull()
  })

  it('returns min from and max to across ads', () => {
    expect(
      computeJobsSalaryRange([
        baseAd({ from: 20_000, to: 26_000 }),
        baseAd({ from: 18_000, to: 30_000 }),
        baseAd(undefined),
      ]),
    ).toEqual({ min: 18_000, max: 30_000 })
  })
})
