import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { JobMarketInsightSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'
import { parseJobMarketInsightSnapshotMetrics } from './parseJobMarketInsightSnapshotMetrics'

type SnapshotRow = {
  metrics: JobMarketInsightSnapshotMetrics | string
}

export const loadJobMarketInsightSnapshotsInRange = async (
  db: Sql,
  from: string,
  to: string,
): Promise<JobMarketInsightSnapshotMetrics[]> => {
  const rows = await observeDbQuery(
    'select',
    'job_market_insight_snapshots',
    () =>
      db<SnapshotRow[]>`
      select metrics
      from job_market_insight_snapshots
      where snapshot_at >= ${from}::date
        and snapshot_at < ${to}::date + interval '1 day'
      order by snapshot_at
    `,
  )

  return rows.map(row => parseJobMarketInsightSnapshotMetrics(row.metrics))
}
