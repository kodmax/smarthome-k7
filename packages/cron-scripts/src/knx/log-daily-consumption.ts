import { knxSchema } from '@repo/knx-schema'
import { getDbPool } from '@repo/db'
import { KnxLink } from 'js-knx'

export async function logDailyConsumption(knx: KnxLink): Promise<void> {
  const db = await getDbPool().getConnection()

  try {
    const lastReading = await db.query(
      'select date, total_reading from daily_energy_readings order by date desc limit 1',
    )

    if (lastReading.length < 1) {
      throw new Error('Missing yesterdays entry')
    }

    const total = await knx.getDatapoint(knxSchema.home.energy.consumption.meterTotalReading).read()
    const consumption = total.value - lastReading[0].total_reading

    await db.query('insert into daily_energy_readings (date, total_reading, daily_consumption) values (?, ?, ?)', [
      new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60_000 - 3_600_000)
        .toISOString()
        .substring(0, 10),
      total.value,
      consumption,
    ])
  } finally {
    await db.release()
  }
}
