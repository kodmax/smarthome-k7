import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computeRemoteWorkPercent } from './computeRemoteWorkPercent'

const makeAd = (workplaceType: JobAd['workplaceType']): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: [],
  workplaceType,
  employmentType: 'permanent',
  publishedAt: '2026-01-01T00:00:00.000Z',
})

describe('computeRemoteWorkPercent', () => {
  it('returns 0 for an empty list', () => {
    expect(computeRemoteWorkPercent([])).toBe(0)
  })

  it('counts remote and hybrid offers', () => {
    expect(computeRemoteWorkPercent([makeAd('remote'), makeAd('hybrid'), makeAd('office'), makeAd('office')])).toBe(50)
  })
})
