import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../../DateTime'
import db from '../../db'
import { EnergyHourConsumption } from '@repo/types'
import { dayStart, getStartOfDayReading } from './helpers'

export const source: DataSourceDefinition<{ date: string; bars: EnergyHourConsumption[]; startOfDayValue: number }> = {
  cron: '1 * * * *',
  id: 'energy-hourly',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,
  script: async () => {
    const conn = await db.getConnection()
    try {
      const today = DateTime.now().getDate()
      const yesterday = DateTime.shift(-1, CacheAgeUnit.DAYS).getDate()
      const startOfDayValue = await getStartOfDayReading(conn, today, yesterday)

      const bars = await conn.query(
        'select hour, hourly_consumption from hourly_energy_readings where datetime >= ? and hourly_consumption is not null',
        [dayStart(today)],
      )

      return {
        startOfDayValue,
        date: today,
        bars,
      }
    } finally {
      conn.release()
    }
  },
}
