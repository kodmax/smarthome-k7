import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { buildJobMarketInsightFeed } from './buildJobMarketInsightFeed'

const makeAd = (overrides: Partial<JobAd> = {}): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: ['React'],
  workplaceType: 'remote',
  employmentType: 'permanent',
  publishedAt: '2026-01-01T00:00:00.000Z',
  monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 },
  ...overrides,
})

describe('buildJobMarketInsightFeed', () => {
  it('builds all aggregation values from ads', () => {
    const feed = buildJobMarketInsightFeed([
      makeAd(),
      makeAd({ id: '2', requiredSkills: ['React'], workplaceType: 'office' }),
    ])

    expect(feed.adsCount).toBe(2)
    expect(feed.popularTechnologies.length).toBeGreaterThan(0)
    expect(feed.salaryDistribution).toHaveLength(7)
  })

  it('calculate remote work mode correctly, not including hybrid', () => {
    const feed = buildJobMarketInsightFeed([
      makeAd(),
      makeAd({ id: '2', requiredSkills: ['React'], workplaceType: 'office' }),
      makeAd({ id: '3', requiredSkills: ['React'], workplaceType: 'hybrid' }),
    ])

    expect(feed.remoteWorkPercent).toBe(33)
  })

  it('calculate hybrid work mode correctly, not including remote or office', () => {
    const feed = buildJobMarketInsightFeed([
      makeAd(),
      makeAd({ id: '2', requiredSkills: ['React'], workplaceType: 'office' }),
      makeAd({ id: '3', requiredSkills: ['React'], workplaceType: 'hybrid' }),
    ])

    expect(feed.hybridWorkPercent).toBe(33)
  })

  it('calculate office work mode correctly, not including hybrid', () => {
    const feed = buildJobMarketInsightFeed([
      makeAd(),
      makeAd({ id: '2', requiredSkills: ['React'], workplaceType: 'office' }),
      makeAd({ id: '3', requiredSkills: ['React'], workplaceType: 'hybrid' }),
    ])

    expect(feed.officeWorkPercent).toBe(33)
  })
})
