import type { PoolConnection } from 'mariadb'
import { dayStart } from './dayStart'
import { getFirstReadingSince } from './getFirstReadingSince'
import { getLatestReading } from './getLatestReading'
import type { HourlyReading } from './types'

export async function getEndReading(conn: PoolConnection, today: string, yesterday: string): Promise<HourlyReading> {
  const reading =
    (await getFirstReadingSince(conn, dayStart(today))) ??
    (await getFirstReadingSince(conn, dayStart(yesterday))) ??
    (await getLatestReading(conn))

  if (!reading) {
    throw new Error('No hourly energy readings found for end boundary')
  }

  return reading
}
