import type { Sql } from '@repo/db'
import { dayStart } from './dayStart'
import { getFirstReadingSince } from './getFirstReadingSince'
import { getLatestReading } from './getLatestReading'
import type { HourlyReading } from './types'

export async function getEndReading(db: Sql, today: string, yesterday: string): Promise<HourlyReading> {
  const reading =
    (await getFirstReadingSince(db, dayStart(today))) ??
    (await getFirstReadingSince(db, dayStart(yesterday))) ??
    (await getLatestReading(db))

  if (!reading) {
    throw new Error('No hourly energy readings found for end boundary')
  }

  return reading
}
