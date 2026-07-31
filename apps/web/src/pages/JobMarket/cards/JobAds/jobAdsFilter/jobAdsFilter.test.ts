import { describe, expect, it } from 'vitest'
import { jobAd, matchAnalysis } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterJobAdsByCategory, getJobAdFilterCategory } from './jobAdsFilter'

describe('jobAdsFilter', () => {
  it('maps apply statuses to filter categories', () => {
    expect(getJobAdFilterCategory('not-applied')).toBe('latest')
    expect(getJobAdFilterCategory('consider')).toBe('consider')
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
    expect(getJobAdFilterCategory('archived')).toBe('archived')
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
      jobAd({ id: '8', title: 'Considering', meta: { application: { status: 'consider' } } }),
      jobAd({ id: '9', title: 'Archived', meta: { application: { status: 'archived' } } }),
    ]

    expect(filterJobAdsByCategory(ads, 'latest').map(ad => ad.content.id)).toEqual(['1'])
    expect(filterJobAdsByCategory(ads, 'consider').map(ad => ad.content.id)).toEqual(['8'])
    expect(filterJobAdsByCategory(ads, 'in-progress').map(ad => ad.content.id)).toEqual(['2'])
    expect(filterJobAdsByCategory(ads, 'not-interested').map(ad => ad.content.id)).toEqual(['3'])
    expect(filterJobAdsByCategory(ads, 'stretch').map(ad => ad.content.id)).toEqual(['4'])
    expect(filterJobAdsByCategory(ads, 'rejected-no-response').map(ad => ad.content.id)).toEqual(['5', '6'])
    expect(filterJobAdsByCategory(ads, 'finished').map(ad => ad.content.id)).toEqual(['7'])
    expect(filterJobAdsByCategory(ads, 'archived').map(ad => ad.content.id)).toEqual(['9'])
  })

  it('filters all ads the user applied to regardless of status', () => {
    const ads = [
      jobAd({
        id: '1',
        title: 'Still applied',
        meta: {
          application: { status: 'applied', appliedAt: '2026-07-16T08:00:00.000Z' },
        },
      }),
      jobAd({
        id: '2',
        title: 'Interview',
        meta: {
          application: { status: 'interview', appliedAt: '2026-07-10T08:00:00.000Z' },
        },
      }),
      jobAd({
        id: '3',
        title: 'Rejected',
        meta: {
          application: { status: 'rejected', appliedAt: '2026-07-01T08:00:00.000Z' },
        },
      }),
      jobAd({
        id: '4',
        title: 'Archived after applying',
        meta: {
          application: { status: 'archived', appliedAt: '2026-06-01T08:00:00.000Z' },
        },
      }),
      jobAd({ id: '5', title: 'Never applied', meta: { application: { status: 'consider' } } }),
      jobAd({
        id: '6',
        title: 'Applied status without timestamp',
        meta: { application: { status: 'applied', appliedAt: null } },
      }),
    ]

    expect(filterJobAdsByCategory(ads, 'applied').map(ad => ad.content.id)).toEqual(['1', '2', '3', '4'])
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

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.content.id)).toEqual(['2', '3'])
  })

  it('excludes archived ads from with-match-analysis filter', () => {
    const ads = [
      jobAd({
        id: '1',
        title: 'Archived with analysis',
        meta: { application: { status: 'archived' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z', summary: 'Old' }),
      }),
      jobAd({
        id: '2',
        title: 'Active with analysis',
        meta: { application: { status: 'applied' } },
        matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-02T00:00:00.000Z', summary: 'Strong fit' }),
      }),
    ]

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.content.id)).toEqual(['2'])
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

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.content.id)).toEqual(['2', '3'])
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

    expect(filterJobAdsByCategory(ads, 'with-match-analysis').map(ad => ad.content.id)).toEqual(['2', '3', '1'])
  })
})
