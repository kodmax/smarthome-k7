import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { EnergyHourConsumption } from '@repo/types'
import { dayStart, getStartOfDayReading, METER_TOTAL_READING } from './helpers'

export class EnergyHourlySource extends DataSourceDefinition<{
  date: string
  bars: EnergyHourConsumption[]
  startOfDayValue: number
}> {
  @Inject('db')
  declare private db: Pool
  getId() {
    return 'energy-hourly'
  }

  getCron() {
    return '1 * * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 5
  }

  async getData() {
    const conn = await this.db.getConnection()
    try {
      const today = DateTime.now().getDate()
      const yesterday = DateTime.shift(-1, CacheAgeUnit.DAYS).getDate()
      const startOfDayValue = await getStartOfDayReading(conn, today, yesterday)

      const bars = await conn.query(
        `select
            hour(date_sub(timestamp, interval 1 hour)) as hour,
            hourly_consumption
          from (
            select
              timestamp,
              reading_value - lag(reading_value) over (order by timestamp) as hourly_consumption
            from readings
            where reading_name = ?
              and timestamp >= ?
          ) as deltas
          where hourly_consumption is not null`,
        [METER_TOTAL_READING, dayStart(today)],
      )

      return {
        startOfDayValue,
        date: today,
        bars,
      }
    } finally {
      conn.release()
    }
  }
}
