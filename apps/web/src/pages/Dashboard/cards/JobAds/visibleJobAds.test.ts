import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterVisibleJobAds, isJobAdVisibleInNormalView } from './visibleJobAds'

describe('visibleJobAds', () => {
  it('shows pending-review, consider, applied and interview ads', () => {
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '1', title: 'Open', meta: { application: { status: 'pending-review' } } }),
      ),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '2', title: 'Consider', meta: { application: { status: 'consider' } } })),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '3', title: 'Applied', meta: { application: { status: 'applied' } } })),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '4', title: 'Interview', meta: { application: { status: 'interview' } } }),
      ),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '5', title: 'No response', meta: { application: { status: 'no-response' } } }),
      ),
    ).toBe(false)
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '6', title: 'Archived', meta: { application: { status: 'archived', archiveReason: 'rejected' } } }),
      ),
    ).toBe(false)
  })

  it('filters visible ads', () => {
    const ads = [
      jobAd({ id: '1', title: 'Open', meta: { application: { status: 'pending-review' } } }),
      jobAd({ id: '2', title: 'Archived', meta: { application: { status: 'archived', archiveReason: 'rejected' } } }),
    ]

    expect(filterVisibleJobAds(ads).map(ad => ad.content.id)).toEqual(['1'])
  })
})
