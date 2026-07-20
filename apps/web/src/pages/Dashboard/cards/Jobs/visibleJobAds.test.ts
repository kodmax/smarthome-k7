import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/Dashboard/test/fixtures/jobs'
import {
  filterHiddenJobAds,
  filterVisibleJobAds,
  getDisplayedJobAds,
  isJobAdVisibleInNormalView,
} from './visibleJobAds'

describe('visibleJobAds', () => {
  it('hides ads in hidden apply statuses', () => {
    const visibleAd = jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } })
    const hiddenAds = [
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
      jobAd({ id: '3', title: 'Accepted', meta: { application: { status: 'offer-accepted' } } }),
      jobAd({ id: '4', title: 'Withdrawn', meta: { application: { status: 'withdrawn' } } }),
      jobAd({
        id: '5',
        title: 'Unmet requirements',
        meta: { application: { status: 'unmet-requirements' } },
      }),
      jobAd({ id: '6', title: 'Not interested', meta: { application: { status: 'not-interested' } } }),
      jobAd({ id: '7', title: 'No response', meta: { application: { status: 'no-response' } } }),
    ]

    expect(isJobAdVisibleInNormalView(visibleAd)).toBe(true)
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

  it('filters hidden ads from a list', () => {
    expect(
      filterHiddenJobAds([
        jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
        jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
      ]).map(ad => ad.id),
    ).toEqual(['2'])
  })

  it('keeps the reading filter in edit mode by default', () => {
    const ads = [
      jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(getDisplayedJobAds(ads, { editMode: true, showHiddenAds: false }).map(ad => ad.id)).toEqual(['1'])
  })

  it('shows only hidden ads in edit mode when filter is inverted', () => {
    const ads = [
      jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(getDisplayedJobAds(ads, { editMode: true, showHiddenAds: true }).map(ad => ad.id)).toEqual(['2'])
  })
})
