import type { PoolConnection } from 'mariadb'
import { dayStart } from './dayStart'
import { getFirstReadingSince } from './getFirstReadingSince'
import { getLatestReading } from './getLatestReading'

export async function getStartOfDayReading(conn: PoolConnection, today: string, yesterday: string): Promise<number> {
  const reading =
    (await getFirstReadingSince(conn, dayStart(today))) ??
    (await getFirstReadingSince(conn, dayStart(yesterday))) ??
    (await getLatestReading(conn))

  if (!reading) {
    throw new Error('No hourly energy readings found for start of day')
  }

  return reading.hour_start_reading
}
