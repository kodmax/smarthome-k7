import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JobMarketInsightMetrics } from '@repo/types'
import DateTime from '@/DateTime'
import { mockSql } from '@/test/mockSql'
import { persistDailyJobMarketInsightSnapshot, toSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'

const metrics: JobMarketInsightMetrics = {
  adsCount: 1,
  newOffersCount: 2,
  medianSalary: 3,
  p90Salary: 3.5,
  p90OffersCount: 4,
  offersWithSalaryRangePercent: 4,
  remoteWorkPercent: 5,
  permanentEmploymentPercent: 6,
  hybridWorkPercent: 7,
  officeWorkPercent: 8,
  popularTechnologies: [{ id: 'react', name: 'React', offersCount: 1, sharePercent: 10, medianSalary: 20 }],
  salaryDistribution: [{ id: 'below10k', percentage: 100 }],
}

const snapshotMetrics = toSnapshotMetrics(metrics)

const mockNow = (date: string, time: string): DateTime =>
  ({
    getDate: () => date,
    getTime: () => time,
    getDateTime: () => `${date}T${time}`,
  }) as DateTime

describe('persistDailyJobMarketInsightSnapshot', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T19:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not query database before 18:00 local time', async () => {
    const db = mockSql()

    await persistDailyJobMarketInsightSnapshot(db, metrics, mockNow('2026-06-28', '10:00:00'))

    expect(db).not.toHaveBeenCalled()
  })

  it('inserts snapshot with current time when run after 18:00 and no entry exists for today', async () => {
    const db = mockSql([], [])

    await persistDailyJobMarketInsightSnapshot(db, metrics, mockNow('2026-06-28', '19:00:00'))

    expect(db).toHaveBeenCalledTimes(2)
  })

  it('does not persist popularTechnologies or salaryDistribution', () => {
    expect(snapshotMetrics).not.toHaveProperty('popularTechnologies')
    expect(snapshotMetrics).not.toHaveProperty('salaryDistribution')
  })

  it('does not insert when today snapshot already exists', async () => {
    const db = mockSql([{ '?column?': 1 }])

    await persistDailyJobMarketInsightSnapshot(db, metrics, mockNow('2026-06-28', '20:00:00'))

    expect(db).toHaveBeenCalledOnce()
  })

  it('uses DateTime.now by default', async () => {
    const db = mockSql([], [])

    await persistDailyJobMarketInsightSnapshot(db, metrics)

    expect(db).toHaveBeenCalledTimes(2)
  })
})
