import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobs'
import { filterVisibleJobAds, isJobAdVisibleInNormalView } from './visibleJobAds'

describe('visibleJobAds', () => {
  it('shows not-applied and applied ads only', () => {
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
    ).toBe(false)
    expect(
      isJobAdVisibleInNormalView(jobAd({ id: '4', title: 'Rejected', meta: { application: { status: 'rejected' } } })),
    ).toBe(false)
  })

  it('filters visible ads from a list while preserving feed order', () => {
    expect(
      filterVisibleJobAds([
        jobAd({ id: '1', title: 'Open', meta: { application: { status: 'not-applied' } } }),
        jobAd({ id: '2', title: 'Rejected', meta: { application: { status: 'rejected' } } }),
        jobAd({ id: '3', title: 'Applied', meta: { application: { status: 'applied' } } }),
      ]).map(ad => ad.id),
    ).toEqual(['1', '3'])
  })
})
