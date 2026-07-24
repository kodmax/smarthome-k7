import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterVisibleJobAds, isJobAdVisibleInNormalView } from './visibleJobAds'

describe('visibleJobAds', () => {
  it('shows not-applied, applied, interview and offer ads', () => {
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '1', title: 'Open', meta: { application: { status: 'not-applied' } } })),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '2', title: 'Applied', meta: { application: { status: 'applied' } } })),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '3', title: 'Interview', meta: { application: { status: 'interview' } } }),
      ),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '4', title: 'Offer', meta: { application: { status: 'offer' } } })),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '5', title: 'Rejected', meta: { application: { status: 'rejected' } } })),
    ).toBe(false)
  })

  it('filters visible ads from a list while preserving feed order', () => {
    expect(
      filterVisibleJobAds([
        jobAd({ id: '1', title: 'Open', meta: { application: { status: 'not-applied' } } }),
        jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
        jobAd({ id: '3', title: 'Applied', meta: { application: { status: 'applied' } } }),
        jobAd({ id: '4', title: 'Interview', meta: { application: { status: 'interview' } } }),
        jobAd({ id: '5', title: 'Offer', meta: { application: { status: 'offer' } } }),
      ]).map(ad => ad.id),
    ).toEqual(['1', '3', '4', '5'])
  })
})
