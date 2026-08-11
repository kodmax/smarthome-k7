import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterJobAdsByAppliedAt } from './filterJobAdsByAppliedAt'

describe('filterJobAdsByAppliedAt', () => {
  const ads = [
    jobAd({
      id: '1',
      title: 'Applied',
      meta: { application: { status: 'archived', archiveReason: 'rejected', appliedAt: '2026-01-01T00:00:00.000Z' } },
    }),
    jobAd({
      id: '2',
      title: 'Never applied',
      meta: { application: { status: 'archived', archiveReason: 'other', appliedAt: null } },
    }),
  ]

  it('returns all ads when filter is off', () => {
    expect(filterJobAdsByAppliedAt(ads, false).map(ad => ad.content.id)).toEqual(['1', '2'])
  })

  it('returns only ads with appliedAt set when filter is on', () => {
    expect(filterJobAdsByAppliedAt(ads, true).map(ad => ad.content.id)).toEqual(['1'])
  })
})
