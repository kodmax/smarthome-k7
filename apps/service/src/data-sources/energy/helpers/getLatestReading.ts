import type { PoolConnection } from 'mariadb'
import type { HourlyReading } from './types'

export async function getLatestReading(conn: PoolConnection): Promise<HourlyReading | undefined> {
  const rows = await conn.query(
    'select datetime, hour_start_reading from hourly_energy_readings order by datetime desc limit 1',
  )

  return rows[0]
}
