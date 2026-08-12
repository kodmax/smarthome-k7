import { JobMarketInsightMetrics } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { JobMarketInsightSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'
import { buildJobMarketInsightFeedWithComparison } from './buildJobMarketInsightFeedWithComparison'

const live: JobMarketInsightMetrics = {
  adsCount: 999,
  newOffersCount: 99,
  medianSalary: 99_999,
  p90Salary: 99_999,
  p90OffersCount: 99,
  offersWithSalaryRangePercent: 99,
  remoteWorkPercent: 99,
  hybridWorkPercent: 99,
  officeWorkPercent: 99,
  permanentEmploymentPercent: 99,
  popularTechnologies: [{ id: 'react', name: 'React', offersCount: 1, sharePercent: 10, medianSalary: 20 }],
  salaryDistribution: [{ id: 'below10k', percentage: 100 }],
}

const snapshotMetrics = (adsCount: number): JobMarketInsightSnapshotMetrics => ({
  adsCount,
  newOffersCount: 1,
  medianSalary: 20_000,
  p90Salary: 30_000,
  p90OffersCount: 5,
  offersWithSalaryRangePercent: 80,
  remoteWorkPercent: 50,
  hybridWorkPercent: 30,
  officeWorkPercent: 20,
  permanentEmploymentPercent: 90,
})

describe('buildJobMarketInsightFeedWithComparison', () => {
  it('builds change metrics from snapshot averages and live lists from current metrics', () => {
    const feed = buildJobMarketInsightFeedWithComparison(snapshotMetrics(100), snapshotMetrics(80), live)

    expect(feed.adsCount).toEqual({ value: live.adsCount, previous: null })
    expect(feed.popularTechnologies).toBe(live.popularTechnologies)
    expect(feed.salaryDistribution).toBe(live.salaryDistribution)
  })

  it('uses null values when snapshot averages are unavailable', () => {
    const feed = buildJobMarketInsightFeedWithComparison(null, null, live)

    expect(feed.adsCount).toEqual({ value: live.adsCount, previous: null })
    expect(feed.popularTechnologies).toBe(live.popularTechnologies)
  })
})
