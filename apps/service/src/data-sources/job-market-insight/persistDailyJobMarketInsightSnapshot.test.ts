import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JobMarketInsightMetrics } from '@repo/types'
import type { Pool } from 'mariadb'
import DateTime from '@/DateTime'
import { persistDailyJobMarketInsightSnapshot } from './persistDailyJobMarketInsightSnapshot'

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
  popularTechnologies: [],
  salaryDistribution: [],
}

const mockNow = (date: string, time: string): DateTime =>
  ({
    getDate: () => date,
    getTime: () => time,
    getDateTime: () => `${date}T${time}`,
  }) as DateTime

describe('persistDailyJobMarketInsightSnapshot', () => {
  const query = vi.fn()
  const release = vi.fn()
  const getConnection = vi.fn(async () => ({ query, release }))
  const db = { getConnection } as unknown as Pool

  beforeEach(() => {
    query.mockReset()
    release.mockReset()
    getConnection.mockClear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T19:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not query database before 18:00 local time', async () => {
    await persistDailyJobMarketInsightSnapshot(db, metrics, mockNow('2026-06-28', '10:00:00'))

    expect(getConnection).not.toHaveBeenCalled()
  })

  it('inserts snapshot with current time when run after 18:00 and no entry exists for today', async () => {
    query.mockResolvedValueOnce([]).mockResolvedValueOnce(undefined)

    await persistDailyJobMarketInsightSnapshot(db, metrics, mockNow('2026-06-28', '19:00:00'))

    expect(query).toHaveBeenNthCalledWith(
      1,
      'select 1 from job_market_insight_snapshots where snapshot_at >= date(?) and snapshot_at < date(?) + interval 1 day limit 1',
      ['2026-06-28T19:00:00', '2026-06-28T19:00:00'],
    )
    expect(query).toHaveBeenNthCalledWith(
      2,
      'insert into job_market_insight_snapshots (snapshot_at, metrics) values (?, ?)',
      ['2026-06-28T19:00:00', JSON.stringify(metrics)],
    )
    expect(release).toHaveBeenCalledOnce()
  })

  it('does not insert when today snapshot already exists', async () => {
    query.mockResolvedValueOnce([{ 1: 1 }])

    await persistDailyJobMarketInsightSnapshot(db, metrics, mockNow('2026-06-28', '20:00:00'))

    expect(query).toHaveBeenCalledOnce()
    expect(release).toHaveBeenCalledOnce()
  })

  it('uses DateTime.now by default', async () => {
    query.mockResolvedValueOnce([]).mockResolvedValueOnce(undefined)

    await persistDailyJobMarketInsightSnapshot(db, metrics)

    const now = DateTime.now()

    expect(query).toHaveBeenNthCalledWith(1, expect.any(String), [now.getDateTime(), now.getDateTime()])
    expect(query).toHaveBeenNthCalledWith(2, expect.any(String), [now.getDateTime(), JSON.stringify(metrics)])
  })
})
