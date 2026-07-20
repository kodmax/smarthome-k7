import { JobMarketInsightMetrics } from '@repo/types'
import type { Pool } from 'mariadb'

type SnapshotRow = {
  metrics: JobMarketInsightMetrics | string
}

const parseMetrics = (metrics: JobMarketInsightMetrics | string): JobMarketInsightMetrics =>
  typeof metrics === 'string' ? (JSON.parse(metrics) as JobMarketInsightMetrics) : metrics

export const loadJobMarketInsightSnapshotAtOrBefore = async (
  db: Pool,
  atOrBefore: string,
): Promise<JobMarketInsightMetrics | null> => {
  const conn = await db.getConnection()

  try {
    const rows = (await conn.query(
      `select metrics
       from job_market_insight_snapshots
       where snapshot_at <= ?
       order by snapshot_at desc
       limit 1`,
      [atOrBefore],
    )) as SnapshotRow[]

    if (rows.length === 0) {
      return null
    }

    return parseMetrics(rows[0].metrics)
  } finally {
    conn.release()
  }
}
