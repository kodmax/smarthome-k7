import { describe, expect, it } from 'vitest'
import { JobMarketInsightSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'
import { averageJobMarketInsightSnapshotMetrics } from './averageJobMarketInsightSnapshotMetrics'

const snapshot = (overrides: Partial<JobMarketInsightSnapshotMetrics> = {}): JobMarketInsightSnapshotMetrics => ({
  adsCount: 100,
  newOffersCount: 10,
  medianSalary: 20_000,
  p90Salary: 30_000,
  p90OffersCount: 5,
  offersWithSalaryRangePercent: 80,
  remoteWorkPercent: 50,
  hybridWorkPercent: 30,
  officeWorkPercent: 20,
  permanentEmploymentPercent: 90,
  ...overrides,
})

describe('averageJobMarketInsightSnapshotMetrics', () => {
  it('returns null for an empty list', () => {
    expect(averageJobMarketInsightSnapshotMetrics([])).toBeNull()
  })

  it('returns the same values for a single snapshot', () => {
    expect(averageJobMarketInsightSnapshotMetrics([snapshot({ adsCount: 42 })])).toEqual(snapshot({ adsCount: 42 }))
  })

  it('averages numeric fields across snapshots', () => {
    expect(
      averageJobMarketInsightSnapshotMetrics([
        snapshot({ adsCount: 100, medianSalary: 20_000 }),
        snapshot({ adsCount: 200, medianSalary: 30_000 }),
      ]),
    ).toEqual(snapshot({ adsCount: 150, medianSalary: 25_000 }))
  })
})
