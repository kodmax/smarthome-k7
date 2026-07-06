import type { PoolConnection } from 'mariadb'
import type { HourlyReading } from './types'

export async function getFirstReadingSince(conn: PoolConnection, since: string): Promise<HourlyReading | undefined> {
  const rows = await conn.query(
    'select datetime, hour_start_reading from energy_readings where datetime >= ? order by datetime asc limit 1',
    [since],
  )

  return rows[0]
}
