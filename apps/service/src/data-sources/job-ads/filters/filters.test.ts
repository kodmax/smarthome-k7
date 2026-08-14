import { toSkillId } from '@repo/common'
import { JobAd, JobAdsFeedItem, emptyJobAdMeta, jobAdApplicationFromMeta } from '@repo/types'
import { describe, expect, it } from 'vitest'
import {
  filterJobAdsByAcceptableSalary,
  filterJobAdsByNotInterestedSkills,
  filterJobAdsFeedItemsByNotInterestedSkills,
  isSalaryAboveThreshold,
  shouldFilterJobAdBySalary,
} from './filters'

const baseAd: JobAd = {
  id: '1',
  origin: 'jj',
  title: 'Senior React Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: ['React', 'TypeScript'],
  workplaceType: 'remote',
  employmentType: 'permanent',
  monthlySalaryRangeAfterTaxes: { from: 26_000, to: 30_000 },
  publishedAt: '2026-01-01T00:00:00.000Z',
}

const adWithStatus = (
  status: JobAdsFeedItem['meta']['application']['status'],
  salary?: JobAd['monthlySalaryRangeAfterTaxes'],
): JobAdsFeedItem => ({
  content: {
    ...baseAd,
    id: `${status}-${salary?.to ?? 'none'}`,
    monthlySalaryRangeAfterTaxes: salary,
  },
  matchAnalysisSummary: null,
  meta: {
    ...emptyJobAdMeta(),
    application: jobAdApplicationFromMeta({
      applyStatus: status,
      archiveReason: status === 'archived' ? 'rejected' : null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    }),
  },
})

describe('isSalaryAboveThreshold', () => {
  it('accepts salary at threshold in the middle of the slider range', () => {
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 } }, 24_000),
    ).toBe(true)
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 20_000, to: 25_000 } }, 25_000),
    ).toBe(true)
  })

  it('rejects salary below threshold in the middle of the slider range', () => {
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 20_000, to: 23_000 } }, 24_000),
    ).toBe(false)
  })

  it('accepts salary above threshold', () => {
    expect(isSalaryAboveThreshold(baseAd, 24_000)).toBe(true)
  })

  it('accepts all salaries at the minimum slider threshold', () => {
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 10_000, to: 12_000 } }, 5_000),
    ).toBe(true)
    expect(isSalaryAboveThreshold(baseAd, 5_000)).toBe(true)
  })

  it('accepts only high salaries at the maximum slider threshold', () => {
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 34_000, to: 35_000 } }, 35_000),
    ).toBe(true)
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 20_000, to: 30_000 } }, 35_000),
    ).toBe(false)
  })

  it('treats ads without salary as zero', () => {
    expect(isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: undefined }, 5_000)).toBe(true)
    expect(isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: undefined }, 24_000)).toBe(false)
  })
})

describe('shouldFilterJobAdBySalary', () => {
  it('exempts active pipeline and archived statuses', () => {
    expect(shouldFilterJobAdBySalary('consider')).toBe(false)
    expect(shouldFilterJobAdBySalary('applied')).toBe(false)
    expect(shouldFilterJobAdBySalary('interview')).toBe(false)
    expect(shouldFilterJobAdBySalary('archived')).toBe(false)
  })

  it('filters pending-review only', () => {
    expect(shouldFilterJobAdBySalary('pending-review')).toBe(true)
  })
})

describe('filterJobAdsByAcceptableSalary', () => {
  it('returns all ads when threshold is null', () => {
    const ads = [adWithStatus('pending-review', { from: 10_000, to: 12_000 })]
    expect(filterJobAdsByAcceptableSalary(ads, null)).toEqual(ads)
  })

  it('keeps pipeline statuses regardless of salary', () => {
    const lowSalary = { from: 10_000, to: 12_000 }
    const ads = [
      adWithStatus('consider', lowSalary),
      adWithStatus('applied', lowSalary),
      adWithStatus('interview', lowSalary),
    ]

    expect(filterJobAdsByAcceptableSalary(ads, 20_000)).toEqual(ads)
  })

  it('keeps pipeline statuses without salary range', () => {
    const ads = [adWithStatus('consider'), adWithStatus('applied'), adWithStatus('interview')]

    expect(filterJobAdsByAcceptableSalary(ads, 20_000)).toEqual(ads)
  })

  it('filters pending-review below threshold', () => {
    const below = adWithStatus('pending-review', { from: 10_000, to: 12_000 })
    const above = adWithStatus('pending-review', { from: 26_000, to: 30_000 })

    expect(filterJobAdsByAcceptableSalary([below, above], 20_000)).toEqual([above])
  })

  it('hides pending-review ads without salary above minimum slider threshold', () => {
    const withoutSalary = adWithStatus('pending-review')

    expect(filterJobAdsByAcceptableSalary([withoutSalary], 5_000)).toEqual([withoutSalary])
    expect(filterJobAdsByAcceptableSalary([withoutSalary], 20_000)).toEqual([])
  })

  it('keeps archived regardless of salary', () => {
    const archived = adWithStatus('archived', { from: 10_000, to: 12_000 })

    expect(filterJobAdsByAcceptableSalary([archived], 20_000)).toEqual([archived])
  })
})

describe('filterJobAdsByNotInterestedSkills', () => {
  it('returns all items when not-interested set is empty', () => {
    const ads = [{ ...baseAd, requiredSkills: ['Java'] }]

    expect(filterJobAdsByNotInterestedSkills(ads, new Set())).toEqual(ads)
  })

  it('removes ads with any required skill marked as not-interested', () => {
    const javaId = toSkillId('Java')
    const ads = [
      { ...baseAd, id: '1', requiredSkills: ['Java', 'Spring'] },
      { ...baseAd, id: '2', requiredSkills: ['Kotlin'] },
    ]

    expect(filterJobAdsByNotInterestedSkills(ads, new Set([javaId]))).toEqual([ads[1]])
  })
})

describe('filterJobAdsFeedItemsByNotInterestedSkills', () => {
  it('filters feed items by normalized required skill ids', () => {
    const javaId = toSkillId('Java')
    const matching = adWithStatus('applied')
    matching.content.requiredSkills = ['Java']
    const other = adWithStatus('pending-review')
    other.content.requiredSkills = ['Kotlin']

    expect(filterJobAdsFeedItemsByNotInterestedSkills([matching, other], new Set([javaId]))).toEqual([other])
  })
})
