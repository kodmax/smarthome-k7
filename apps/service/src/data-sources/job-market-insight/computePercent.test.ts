import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computePercent } from './computePercent'

const makeAd = (overrides: Partial<JobAd> = {}): JobAd => ({
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
  ...overrides,
})

describe('computePercent', () => {
  it('returns 0 for an empty list', () => {
    expect(computePercent([], () => true)).toBe(0)
  })

  it('counts remote and hybrid offers', () => {
    expect(
      computePercent(
        [makeAd({ workplaceType: 'remote' }), makeAd({ workplaceType: 'hybrid' }), makeAd({ workplaceType: 'office' })],
        ad => ad.workplaceType === 'remote' || ad.workplaceType === 'hybrid',
      ),
    ).toBe(67)
  })

  it('returns the share of ads with salary ranges', () => {
    expect(
      computePercent(
        [
          makeAd({ monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 } }),
          makeAd({ monthlySalaryRangeAfterTaxes: { from: 26_000, to: 30_000 } }),
          makeAd(),
        ],
        ad => ad.monthlySalaryRangeAfterTaxes !== undefined,
      ),
    ).toBe(67)
  })

  it('returns the share of permanent employment offers', () => {
    expect(
      computePercent(
        [makeAd({ employmentType: 'permanent' }), makeAd({ employmentType: 'b2b' })],
        ad => ad.employmentType === 'permanent',
      ),
    ).toBe(50)
  })
})
