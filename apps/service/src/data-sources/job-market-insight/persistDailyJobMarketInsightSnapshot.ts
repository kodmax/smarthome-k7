import { JobMarketInsightMetrics } from '@repo/types'
import type { Sql } from '@repo/db'
import DateTime from '@/DateTime'
import { observeDbQuery } from '@/prometheus/dbMetrics'

const DAILY_SNAPSHOT_TIME = '18:00:00'

type JobMarketInsightSnapshotMetrics = Omit<JobMarketInsightMetrics, 'popularTechnologies' | 'salaryDistribution'>

export const toSnapshotMetrics = (metrics: JobMarketInsightMetrics): JobMarketInsightSnapshotMetrics => ({
  adsCount: metrics.adsCount,
  newOffersCount: metrics.newOffersCount,
  medianSalary: metrics.medianSalary,
  p90Salary: metrics.p90Salary,
  p90OffersCount: metrics.p90OffersCount,
  offersWithSalaryRangePercent: metrics.offersWithSalaryRangePercent,
  remoteWorkPercent: metrics.remoteWorkPercent,
  hybridWorkPercent: metrics.hybridWorkPercent,
  officeWorkPercent: metrics.officeWorkPercent,
  permanentEmploymentPercent: metrics.permanentEmploymentPercent,
})

export const persistDailyJobMarketInsightSnapshot = async (
  db: Sql,
  metrics: JobMarketInsightMetrics,
  now: DateTime = DateTime.now(),
): Promise<void> => {
  if (now.getTime() < DAILY_SNAPSHOT_TIME) {
    return
  }

  const dateTime = now.getDateTime()
  const existingRows = await observeDbQuery(
    'select',
    'job_market_insight_snapshots',
    () =>
      db`
      select 1 from job_market_insight_snapshots
      where snapshot_at >= ${dateTime}::date
        and snapshot_at < ${dateTime}::date + interval '1 day'
      limit 1
    `,
  )

  if (existingRows.length > 0) {
    return
  }

  await observeDbQuery(
    'insert',
    'job_market_insight_snapshots',
    () =>
      db`
      insert into job_market_insight_snapshots (snapshot_at, metrics)
      values (${dateTime}, ${db.json(toSnapshotMetrics(metrics))})
    `,
  )
}
