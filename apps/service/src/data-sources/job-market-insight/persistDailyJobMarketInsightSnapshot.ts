import { JobMarketInsightMetrics } from '@repo/types'
import type { Pool } from 'mariadb'
import DateTime from '@/DateTime'

const DAILY_SNAPSHOT_TIME = '18:00:00'

type JobMarketInsightSnapshotMetrics = Omit<JobMarketInsightMetrics, 'popularTechnologies' | 'salaryDistribution'>

export const toSnapshotMetrics = (metrics: JobMarketInsightMetrics): JobMarketInsightSnapshotMetrics => {
  const {
    popularTechnologies: _popularTechnologies,
    salaryDistribution: _salaryDistribution,
    ...snapshotMetrics
  } = metrics

  return snapshotMetrics
}

export const persistDailyJobMarketInsightSnapshot = async (
  db: Pool,
  metrics: JobMarketInsightMetrics,
  now: DateTime = DateTime.now(),
): Promise<void> => {
  if (now.getTime() < DAILY_SNAPSHOT_TIME) {
    return
  }

  const conn = await db.getConnection()

  try {
    const existingRows = (await conn.query(
      'select 1 from job_market_insight_snapshots where snapshot_at >= date(?) and snapshot_at < date(?) + interval 1 day limit 1',
      [now.getDateTime(), now.getDateTime()],
    )) as unknown[]

    if (existingRows.length > 0) {
      return
    }

    await conn.query('insert into job_market_insight_snapshots (snapshot_at, metrics) values (?, ?)', [
      now.getDateTime(),
      JSON.stringify(toSnapshotMetrics(metrics)),
    ])
  } finally {
    conn.release()
  }
}
