import { DataSource, CacheAgeUnit } from '@repo/feeds'
import DateTime from '../DateTime'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import type { Sql } from '@repo/db'
import { Co2HistoryRecord } from '@repo/types'

export class HumidityHourlySource extends DataSource<{ date: string; today: Co2HistoryRecord[] }> {
  @Inject('db')
  declare private db: Sql

  static getId() {
    return 'humidity-hourly'
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
    return {
      today: await observeDbQuery(
        'select',
        'readings',
        () =>
          this.db<Co2HistoryRecord[]>`
          select
            extract(hour from timestamp)::int as hour,
            avg(reading_value) as value
          from readings
          where timestamp >= ${DateTime.now().getDate()}
            and reading_name = 'humidity'
          group by extract(hour from timestamp)
          order by extract(hour from timestamp) asc
        `,
      ),
      date: DateTime.now().getDate(),
    }
  }
}
