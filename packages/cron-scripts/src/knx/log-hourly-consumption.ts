import { knxSchema } from '@repo/knx-schema'
import { getDbPool } from '@repo/db'
import { KnxLink } from 'js-knx'

const METER_TOTAL_READING = 'meter_total'

export async function logHourlyConsumption(knx: KnxLink): Promise<void> {
  const now = new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  const db = await getDbPool().getConnection()

  if (now % 3_600_000 > 180_000) {
    throw new Error('This script needs to be run in the first 3 minutes of an hour!')
  }

  try {
    const total = await knx.group(knxSchema.home.energy.consumption.meterTotalReading).read()
    const thisHour = new Date(now - (now % 3_600_000))

    await db.query('insert into readings (timestamp, reading_name, reading_value) values (?, ?, ?)', [
      thisHour.toISOString().substring(0, 19),
      METER_TOTAL_READING,
      total.value,
    ])
  } finally {
    await db.release()
  }
}
