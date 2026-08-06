import { knxSchema } from '@repo/knx-schema'
import { getSql } from '@repo/db'
import type { Logger } from '@repo/logger'
import { KnxLink } from 'js-knx'

const METER_TOTAL_READING = 'meter_total'

export async function logHourlyConsumption(knx: KnxLink, logger?: Logger): Promise<void> {
  const now = new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  const db = getSql()

  if (now % 3_600_000 > 180_000) {
    throw new Error('This script needs to be run in the first 3 minutes of an hour!')
  }

  const total = await knx.group(knxSchema.home.energy.consumption.meterTotalReading).read()
  const thisHour = new Date(now - (now % 3_600_000))

  await db`
    insert into readings (timestamp, reading_name, reading_value)
    values (${thisHour.toISOString().substring(0, 19)}, ${METER_TOTAL_READING}, ${total.value})
  `

  logger?.info(
    { readingName: METER_TOTAL_READING, readingValue: total.value, hour: thisHour.toISOString() },
    'Hourly consumption logged',
  )
}
