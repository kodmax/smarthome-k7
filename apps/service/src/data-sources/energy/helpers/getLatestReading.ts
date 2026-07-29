import type { PoolConnection } from 'mariadb'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { METER_TOTAL_READING } from './meterTotalReading'
import type { HourlyReading } from './types'

export async function getLatestReading(conn: PoolConnection): Promise<HourlyReading | undefined> {
  const rows = await observeDbQuery('select', 'readings', () =>
    conn.query(
      `select timestamp as datetime, reading_value as hour_start_reading
     from readings
     where reading_name = ?
     order by timestamp desc
     limit 1`,
      [METER_TOTAL_READING],
    ),
  )

  return rows[0]
}
