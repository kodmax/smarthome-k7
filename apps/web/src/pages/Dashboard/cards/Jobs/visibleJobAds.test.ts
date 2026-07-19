import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/Dashboard/test/fixtures/jobs'
import { filterVisibleJobAds, getDisplayedJobAds, isJobAdVisibleInNormalView } from './visibleJobAds'

describe('visibleJobAds', () => {
  it('hides ads in terminal apply statuses', () => {
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } })),
    ).toBe(true)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } })),
    ).toBe(false)
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '3', title: 'Accepted', meta: { application: { status: 'offer-accepted' } } }),
      ),
    ).toBe(false)
    expect(
      isJobAdVisibleInNormalView(
        jobAd({ id: '4', title: 'Not interested', meta: { application: { status: 'not-interested' } } }),
      ),
    ).toBe(false)
  })

  it('filters terminal ads from a list', () => {
    expect(
      filterVisibleJobAds([
        jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
        jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
      ]).map(ad => ad.id),
    ).toEqual(['1'])
  })

  it('keeps the reading filter in edit mode by default', () => {
    const ads = [
      jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(getDisplayedJobAds(ads, { editMode: true, showAllAds: false }).map(ad => ad.id)).toEqual(['1'])
  })

  it('shows all ads in edit mode when showAllAds is enabled', () => {
    const ads = [
      jobAd({ id: '1', title: 'Open', meta: { application: { status: 'applied' } } }),
      jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
    ]

    expect(getDisplayedJobAds(ads, { editMode: true, showAllAds: true }).map(ad => ad.id)).toEqual(['1', '2'])
  })
})
