import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobs'
import { filterJobAdsByCategory, getJobAdFilterCategory } from './jobAdsFilter'

describe('jobAdsFilter', () => {
  it('maps apply statuses to filter categories', () => {
    expect(getJobAdFilterCategory('not-applied')).toBe('latest')
    expect(getJobAdFilterCategory('applied')).toBe('in-progress')
    expect(getJobAdFilterCategory('not-interested')).toBe('not-interested')
    expect(getJobAdFilterCategory('unmet-requirements')).toBe('stretch')
    expect(getJobAdFilterCategory('stack-mismatch')).toBe('finished')
    expect(getJobAdFilterCategory('no-response')).toBe('finished')
    expect(getJobAdFilterCategory('interview')).toBe('in-progress')
    expect(getJobAdFilterCategory('offer')).toBe('in-progress')
    expect(getJobAdFilterCategory('rejected')).toBe('finished')
    expect(getJobAdFilterCategory('offer-accepted')).toBe('finished')
    expect(getJobAdFilterCategory('withdrawn')).toBe('finished')
  })

  it('filters ads by category', () => {
    const ads = [
      jobAd({ id: '1', title: 'New', meta: { application: { status: 'not-applied' } } }),
      jobAd({ id: '2', title: 'Applied', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '3', title: 'Skipped', meta: { application: { status: 'not-interested' } } }),
      jobAd({ id: '4', title: 'Skill gap', meta: { application: { status: 'unmet-requirements' } } }),
      jobAd({ id: '5', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(filterJobAdsByCategory(ads, 'latest').map(ad => ad.id)).toEqual(['1'])
    expect(filterJobAdsByCategory(ads, 'in-progress').map(ad => ad.id)).toEqual(['2'])
    expect(filterJobAdsByCategory(ads, 'not-interested').map(ad => ad.id)).toEqual(['3'])
    expect(filterJobAdsByCategory(ads, 'stretch').map(ad => ad.id)).toEqual(['4'])
    expect(filterJobAdsByCategory(ads, 'finished').map(ad => ad.id)).toEqual(['5'])
  })
})
