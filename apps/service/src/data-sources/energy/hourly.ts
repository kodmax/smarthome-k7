import { CacheAgeUnit, DataSource } from '@repo/feeds'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import type { Sql } from '@repo/db'
import { EnergyHourConsumption } from '@repo/types'
import { dayStart, getStartOfDayReading, METER_TOTAL_READING } from './helpers'

export class EnergyHourlySource extends DataSource<{
  date: string
  bars: EnergyHourConsumption[]
  startOfDayValue: number
}> {
  @Inject('db')
  declare private db: Sql

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
    const today = DateTime.now().getDate()
    const yesterday = DateTime.shift(-1, DateTime.DAY).getDate()
    const startOfDayValue = await getStartOfDayReading(this.db, today, yesterday)

    const bars = await observeDbQuery(
      'select',
      'readings',
      () =>
        this.db<EnergyHourConsumption[]>`
        select
          extract(hour from (timestamp - interval '1 hour'))::int as hour,
          hourly_consumption
        from (
          select
            timestamp,
            reading_value - lag(reading_value) over (order by timestamp) as hourly_consumption
          from readings
          where reading_name = ${METER_TOTAL_READING}
            and timestamp >= ${dayStart(today)}
        ) as deltas
        where hourly_consumption is not null
      `,
    )

    return {
      startOfDayValue,
      date: today,
      bars,
    }
  }
}
