import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterJobAdsByCategory } from './jobAdsFilter'

describe('jobAdsFilter', () => {
  it('filters ads by status 1:1', () => {
    const ads = [
      jobAd({ id: '1', title: 'New', meta: { application: { status: 'pending-review' } } }),
      jobAd({ id: '2', title: 'Applied', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '3', title: 'Consider', meta: { application: { status: 'consider' } } }),
      jobAd({ id: '5', title: 'Interview', meta: { application: { status: 'interview' } } }),
      jobAd({
        id: '6',
        title: 'Archived',
        meta: { application: { status: 'archived', archiveReason: 'rejected' } },
      }),
    ]

    expect(filterJobAdsByCategory(ads, 'pending-review').map(ad => ad.content.id)).toEqual(['1'])
    expect(filterJobAdsByCategory(ads, 'applied').map(ad => ad.content.id)).toEqual(['2'])
    expect(filterJobAdsByCategory(ads, 'consider').map(ad => ad.content.id)).toEqual(['3'])
    expect(filterJobAdsByCategory(ads, 'interview').map(ad => ad.content.id)).toEqual(['5'])
    expect(filterJobAdsByCategory(ads, 'archived').map(ad => ad.content.id)).toEqual(['6'])
  })
})
