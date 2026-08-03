import { CacheAgeUnit, DataSource } from '@repo/feeds'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import type { Pool } from 'mariadb'
import { EnergyHourConsumption } from '@repo/types'
import { dayStart, getStartOfDayReading, METER_TOTAL_READING } from './helpers'

export class EnergyHourlySource extends DataSource<{
  date: string
  bars: EnergyHourConsumption[]
  startOfDayValue: number
}> {
  @Inject('db')
  declare private db: Pool

  static getId() {
    return 'energy-hourly'
  }

  static getCron() {
    return '1 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.MINUTE * 5
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData() {
    const conn = await this.db.getConnection()
    try {
      const today = DateTime.now().getDate()
      const yesterday = DateTime.shift(-1, DateTime.DAY).getDate()
      const startOfDayValue = await getStartOfDayReading(conn, today, yesterday)

      const bars = await observeDbQuery('select', 'readings', () =>
        conn.query(
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
        ),
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
