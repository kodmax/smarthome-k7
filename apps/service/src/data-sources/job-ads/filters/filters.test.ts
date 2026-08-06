import { JobAd, JobAdsFeedItem, emptyJobAdMeta, jobAdApplicationFromMeta } from '@repo/types'
import { describe, expect, it } from 'vitest'
import {
  filterJobAdsByAcceptableSalary,
  isHybridOrRemote,
  isSalaryAboveThreshold,
  notManager,
  noUwantedSkills,
  shouldFilterJobAdBySalary,
  withReact,
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
  matchAnalysis: null,
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

describe('noUwantedSkills', () => {
  it('rejects ads requiring Python', () => {
    expect(noUwantedSkills({ ...baseAd, requiredSkills: ['Python', 'React'] })).toBe(false)
  })

  it('rejects ads requiring Angular', () => {
    expect(noUwantedSkills({ ...baseAd, requiredSkills: ['Angular'] })).toBe(false)
  })

  it('accepts ads with React and no blocked skills', () => {
    expect(noUwantedSkills(baseAd)).toBe(true)
  })
})

describe('isSalaryAboveThreshold', () => {
  it('rejects salary at or below threshold', () => {
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 } }, 24_000),
    ).toBe(false)
    expect(
      isSalaryAboveThreshold({ ...baseAd, monthlySalaryRangeAfterTaxes: { from: 20_000, to: 25_000 } }, 25_000),
    ).toBe(false)
  })

  it('accepts salary above threshold', () => {
    expect(isSalaryAboveThreshold(baseAd, 24_000)).toBe(true)
  })

  it('rejects ads without salary range', () => {
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

  it('keeps archived regardless of salary', () => {
    const archived = adWithStatus('archived', { from: 10_000, to: 12_000 })

    expect(filterJobAdsByAcceptableSalary([archived], 20_000)).toEqual([archived])
  })
})

describe('notManager', () => {
  it('rejects titles containing Manager', () => {
    expect(notManager({ ...baseAd, title: 'Engineering Manager' })).toBe(false)
  })

  it('accepts titles without Manager', () => {
    expect(notManager(baseAd)).toBe(true)
  })
})

describe('withReact', () => {
  it('requires React in skills', () => {
    expect(withReact({ ...baseAd, requiredSkills: ['Vue'] })).toBe(false)
    expect(withReact(baseAd)).toBe(true)
  })
})

describe('isHybridOrRemote', () => {
  it('accepts hybrid and remote', () => {
    expect(isHybridOrRemote({ ...baseAd, workplaceType: 'hybrid' })).toBe(true)
    expect(isHybridOrRemote({ ...baseAd, workplaceType: 'remote' })).toBe(true)
  })

  it('rejects office', () => {
    expect(isHybridOrRemote({ ...baseAd, workplaceType: 'office' })).toBe(false)
  })
})
