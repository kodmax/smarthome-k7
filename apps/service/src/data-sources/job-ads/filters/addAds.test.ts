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
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('addAds', () => {
  it('adds ads to the map', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd()

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- SENIOR REACT DEVELOPER')).toBe(ad)
  })

  it('adds ads regardless of skills', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd({ requiredSkills: ['Python', 'React'] })

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- SENIOR REACT DEVELOPER')).toBe(ad)
  })

  it('adds ads regardless of salary', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd({ monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 } })

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- SENIOR REACT DEVELOPER')).toBe(ad)
  })

  it('adds office-only ads', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd({ workplaceType: 'office' })

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- SENIOR REACT DEVELOPER')).toBe(ad)
  })

  it('adds manager titles', () => {
    const allAds = new Map<string, JobAd>()
    const ad = makeAd({ title: 'Engineering Manager' })

    addAds(allAds, [ad])

    expect(allAds.size).toBe(1)
    expect(allAds.get('acme -- ENGINEERING MANAGER')).toBe(ad)
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
