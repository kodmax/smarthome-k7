import { JobMarketInsightFeed } from '@repo/types'
import type { Pool } from 'mariadb'

export const persistJobMarketInsightSnapshot = async (
  db: Pool,
  snapshotAt: string,
  metrics: JobMarketInsightFeed,
): Promise<void> => {
  const conn = await db.getConnection()

  try {
    await conn.query('insert into job_market_insight_snapshots (snapshot_at, metrics, ads_count) values (?, ?, ?)', [
      snapshotAt,
      JSON.stringify(metrics),
      metrics.adsCount,
    ])
  } finally {
    conn.release()
  }
}
