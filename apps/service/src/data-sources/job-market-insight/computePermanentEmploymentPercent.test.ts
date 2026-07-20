import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computePermanentEmploymentPercent } from './computePermanentEmploymentPercent'

const makeAd = (employmentType: JobAd['employmentType']): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: [],
  workplaceType: 'remote',
  employmentType,
  publishedAt: '2026-01-01T00:00:00.000Z',
})

describe('computePermanentEmploymentPercent', () => {
  it('returns 0 for an empty list', () => {
    expect(computePermanentEmploymentPercent([])).toBe(0)
  })

  it('returns the share of permanent employment offers', () => {
    expect(
      computePermanentEmploymentPercent([makeAd('permanent'), makeAd('permanent'), makeAd('b2b'), makeAd('b2b')]),
    ).toBe(50)
  })
})
