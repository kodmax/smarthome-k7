import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/Dashboard/test/fixtures/jobs'
import { filterVisibleJobAds, isJobAdVisibleInNormalView } from './visibleJobAds'

describe('visibleJobAds', () => {
  it('hides ads in hidden apply statuses', () => {
    const visibleAds = [jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } })]
    const hiddenAds = [
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
      jobAd({ id: '3', title: 'Accepted', meta: { application: { status: 'offer-accepted' } } }),
      jobAd({ id: '4', title: 'Withdrawn', meta: { application: { status: 'withdrawn' } } }),
      jobAd({
        id: '5',
        title: 'Unmet requirements',
        meta: { application: { status: 'unmet-requirements' } },
      }),
      jobAd({ id: '6', title: 'Stack mismatch', meta: { application: { status: 'stack-mismatch' } } }),
      jobAd({ id: '7', title: 'Not interested', meta: { application: { status: 'not-interested' } } }),
      jobAd({ id: '8', title: 'No response', meta: { application: { status: 'no-response' } } }),
    ]

    for (const ad of visibleAds) {
      expect(isJobAdVisibleInNormalView(ad)).toBe(true)
    }
    for (const ad of hiddenAds) {
      expect(isJobAdVisibleInNormalView(ad)).toBe(false)
    }
  })

  it('filters visible ads from a list', () => {
    expect(
      filterVisibleJobAds([
        jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
        jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
      ]).map(ad => ad.id),
    ).toEqual(['1'])
  })
})
