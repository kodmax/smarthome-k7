import { JobMarketInsightMetrics } from '@repo/types'
import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'

type SnapshotRow = {
  metrics: JobMarketInsightMetrics | string
}

const parseMetrics = (metrics: JobMarketInsightMetrics | string): JobMarketInsightMetrics =>
  typeof metrics === 'string' ? (JSON.parse(metrics) as JobMarketInsightMetrics) : metrics

export const loadJobMarketInsightSnapshotAtOrBefore = async (
  db: Sql,
  atOrBefore: string,
): Promise<JobMarketInsightMetrics | null> => {
  const rows = await observeDbQuery(
    'select',
    'job_market_insight_snapshots',
    () =>
      db<SnapshotRow[]>`
      select metrics
      from job_market_insight_snapshots
      where snapshot_at <= ${atOrBefore}
      order by snapshot_at desc
      limit 1
    `,
  )

  if (rows.length === 0) {
    return null
  }

  return parseMetrics(rows[0].metrics)
}
