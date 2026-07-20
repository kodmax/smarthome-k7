import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/Dashboard/test/fixtures/jobs'
import { filterVisibleJobAds, getDisplayedJobAds, isJobAdVisibleInNormalView } from './visibleJobAds'

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

  it('keeps the normal view filter outside edit mode', () => {
    const ads = [
      jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(getDisplayedJobAds(ads, { editMode: false, filter: 'finished' }).map(ad => ad.id)).toEqual(['1'])
  })

  it('uses the selected category filter in edit mode', () => {
    const ads = [
      jobAd({ id: '1', title: 'New', meta: { application: { status: 'not-applied' } } }),
      jobAd({ id: '2', title: 'Applied', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '3', title: 'Skipped', meta: { application: { status: 'not-interested' } } }),
      jobAd({ id: '4', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(getDisplayedJobAds(ads, { editMode: true, filter: 'new' }).map(ad => ad.id)).toEqual(['1'])
    expect(getDisplayedJobAds(ads, { editMode: true, filter: 'in-progress' }).map(ad => ad.id)).toEqual(['2'])
    expect(getDisplayedJobAds(ads, { editMode: true, filter: 'not-interested' }).map(ad => ad.id)).toEqual(['3'])
    expect(getDisplayedJobAds(ads, { editMode: true, filter: 'finished' }).map(ad => ad.id)).toEqual(['4'])
  })
})
