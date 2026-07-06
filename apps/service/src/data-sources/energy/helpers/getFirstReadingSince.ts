import type { PoolConnection } from 'mariadb'
import { METER_TOTAL_READING } from './meterTotalReading'
import type { HourlyReading } from './types'

export async function getFirstReadingSince(conn: PoolConnection, since: string): Promise<HourlyReading | undefined> {
  const rows = await conn.query(
    `select timestamp as datetime, reading_value as hour_start_reading
     from readings
     where reading_name = ?
       and timestamp >= ?
     order by timestamp asc
     limit 1`,
    [METER_TOTAL_READING, since],
  )

  return rows[0]
}
