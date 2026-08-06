import type { Sql } from '@repo/db'
import { dayStart } from './dayStart'
import { getFirstReadingSince } from './getFirstReadingSince'
import { getLatestReading } from './getLatestReading'

export async function getStartOfDayReading(db: Sql, today: string, yesterday: string): Promise<number> {
  const reading =
    (await getFirstReadingSince(db, dayStart(today))) ??
    (await getFirstReadingSince(db, dayStart(yesterday))) ??
    (await getLatestReading(db))

  if (!reading) {
    throw new Error('No hourly energy readings found for start of day')
  }

  return reading.hour_start_reading
}
