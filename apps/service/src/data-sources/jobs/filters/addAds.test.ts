import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { addAds } from './addAds'

const makeAd = (overrides: Partial<JobAd> = {}): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Senior React Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: ['React'],
  workplaceType: 'remote',
  employmentType: 'permanent',
  monthlySalaryRangeAfterTaxes: { from: 26_000, to: 30_000 },
  ...overrides,
})

describe('addAds', () => {
  it('adds ads passing all filters', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd()

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- SENIOR REACT DEVELOPER')).toBe(ad)
  })

  it('accepts ads with unwanted skills when other filters pass', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd({ requiredSkills: ['Python', 'React'] })

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- SENIOR REACT DEVELOPER')).toBe(ad)
  })

  it('rejects ads with salary below threshold', () => {
    const allAds = new Map<string, JobAd>()
    addAds(allAds, [makeAd({ monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 } })])
    expect(allAds.size).toBe(0)
  })

  it('rejects office-only ads', () => {
    const allAds = new Map<string, JobAd>()
    addAds(allAds, [makeAd({ workplaceType: 'office' })])
    expect(allAds.size).toBe(0)
  })

  it('rejects manager titles', () => {
    const allAds = new Map<string, JobAd>()
    addAds(allAds, [makeAd({ title: 'Engineering Manager' })])
    expect(allAds.size).toBe(0)
  })

  it('deduplicates by company name and title (case-insensitive)', () => {
    const allAds = new Map<string, JobAd>()
    const first = makeAd({ id: '1', companyName: 'Acme', title: 'React Dev' })
    const duplicate = makeAd({ id: '2', companyName: 'ACME', title: 'react dev' })

    addAds(allAds, [first, duplicate])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- REACT DEV')).toBe(first)
  })
})
