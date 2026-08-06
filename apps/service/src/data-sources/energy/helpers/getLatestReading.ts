import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { METER_TOTAL_READING } from './meterTotalReading'
import type { HourlyReading } from './types'

export async function getLatestReading(db: Sql): Promise<HourlyReading | undefined> {
  const rows = await observeDbQuery(
    'select',
    'readings',
    () =>
      db<HourlyReading[]>`
      select timestamp as datetime, reading_value as hour_start_reading
      from readings
      where reading_name = ${METER_TOTAL_READING}
      order by timestamp desc
      limit 1
    `,
  )

  return rows[0]
}
