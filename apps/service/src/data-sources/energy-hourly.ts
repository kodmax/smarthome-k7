import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { EnergyHourConsumption } from '@repo/types'

export const source: DataSourceDefinition<{ date: string; bars: EnergyHourConsumption[]; startOfDayValue: number }> = {
  cron: '1 * * * *',
  id: 'energy-hourly',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,
  script: async () => {
    const conn = await db.getConnection()
    try {
      const startOfDayRecord = await conn.query(
        'select date, total_reading from daily_energy_readings order by date desc limit 1',
      )

      const bars = await conn.query(
        'SELECT hour, hourly_consumption FROM hourly_energy_readings WHERE Date(datetime) = ? and hourly_consumption is not null',
        [new DateTime().getDate()],
      )

      return {
        startOfDayValue: startOfDayRecord[0].total_reading,
        date: new DateTime().getDate(),
        bars,
      }
    } finally {
      conn.release()
    }
  },
}
