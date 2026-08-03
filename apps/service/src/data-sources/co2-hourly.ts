import { DataSource, CacheAgeUnit } from '@repo/feeds'
import DateTime from '../DateTime'
import { Inject } from '../di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { Co2HistoryRecord } from '@repo/types'
import type { Pool } from 'mariadb'

export class Co2HourlySource extends DataSource<{ date: string; today: Co2HistoryRecord[] }> {
  @Inject('db')
  declare private db: Pool

  static getId() {
    return 'co2-hourly'
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
      return {
        today: await observeDbQuery('select', 'readings', () =>
          conn.query(
            `select
              hour(timestamp) as hour,
              avg(reading_value) as value
              from readings
              where timestamp >= ?
                and reading_name = 'co2'
              group by hour(timestamp)
              order by hour(timestamp) ASC`,
            [DateTime.now().getDate()],
          ),
        ),
        date: DateTime.now().getDate(),
      }
    } finally {
      conn.release()
    }
  }
}
