import { describe, expect, it } from 'vitest'
import { jobAd, matchAnalysis } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterJobAdsByCategory, getJobAdFilterCategory } from './jobAdsFilter'

describe('jobAdsFilter', () => {
  it('maps apply statuses to filter categories', () => {
    expect(getJobAdFilterCategory('not-applied')).toBe('latest')
    expect(getJobAdFilterCategory('applied')).toBe('in-progress')
    expect(getJobAdFilterCategory('not-interested')).toBe('not-interested')
    expect(getJobAdFilterCategory('unmet-requirements')).toBe('stretch')
    expect(getJobAdFilterCategory('stack-mismatch')).toBe('finished')
    expect(getJobAdFilterCategory('no-response')).toBe('rejected-no-response')
    expect(getJobAdFilterCategory('interview')).toBe('in-progress')
    expect(getJobAdFilterCategory('offer')).toBe('in-progress')
    expect(getJobAdFilterCategory('rejected')).toBe('rejected-no-response')
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
      jobAd({ id: '6', title: 'No response', meta: { application: { status: 'no-response' } } }),
      jobAd({ id: '7', title: 'Accepted', meta: { application: { status: 'offer-accepted' } } }),
    ]

    expect(filterJobAdsByCategory(ads, 'latest').map(ad => ad.id)).toEqual(['1'])
    expect(filterJobAdsByCategory(ads, 'in-progress').map(ad => ad.id)).toEqual(['2'])
    expect(filterJobAdsByCategory(ads, 'not-interested').map(ad => ad.id)).toEqual(['3'])
    expect(filterJobAdsByCategory(ads, 'stretch').map(ad => ad.id)).toEqual(['4'])
    expect(filterJobAdsByCategory(ads, 'rejected-no-response').map(ad => ad.id)).toEqual(['5', '6'])
    expect(filterJobAdsByCategory(ads, 'finished').map(ad => ad.id)).toEqual(['7'])
  })

  it('filters ads with match analysis', () => {
    const ads = [
      jobAd({ id: '1', title: 'No analysis' }),
      jobAd({
        id: '2',
        title: 'Analyzed',
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z', summary: 'OK' }),
      }),
      jobAd({
        id: '3',
        title: 'Also analyzed',
        meta: { application: { status: 'applied' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-02T00:00:00.000Z', summary: 'Strong fit' }),
      }),
      jobAd({
        id: '4',
        title: 'Terminal analyzed',
        meta: { application: { status: 'offer-accepted' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-03T00:00:00.000Z', summary: 'Done' }),
      }),
    ]

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.id)).toEqual(['2', '3'])
  })

  it('excludes finished ads from with-match-analysis filter', () => {
    const ads = [
      jobAd({
        id: '1',
        title: 'Accepted with analysis',
        meta: { application: { status: 'offer-accepted' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z', summary: 'OK' }),
      }),
      jobAd({
        id: '2',
        title: 'Rejected with analysis',
        meta: { application: { status: 'rejected' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-02T00:00:00.000Z', summary: 'No' }),
      }),
      jobAd({
        id: '3',
        title: 'Active with analysis',
        meta: { application: { status: 'interview' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-03T00:00:00.000Z', summary: 'Strong fit' }),
      }),
    ]

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.id)).toEqual(['2', '3'])
  })

  it('sorts with-match-analysis ads by score descending', () => {
    const ads = [
      jobAd({
        id: '1',
        title: 'Moderate fit',
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z', score: 60 }),
      }),
      jobAd({
        id: '2',
        title: 'Strong fit',
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-02T00:00:00.000Z', score: 90 }),
      }),
      jobAd({
        id: '3',
        title: 'Good fit',
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-03T00:00:00.000Z', score: 75 }),
      }),
    ]

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.id)).toEqual(['2', '3', '1'])
  })
})
