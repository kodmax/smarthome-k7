import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import { Inject } from '../di'
import { Co2HistoryRecord } from '@repo/types'
import type { Pool } from 'mariadb'

export class Co2HourlySource extends DataSourceDefinition<{ date: string; today: Co2HistoryRecord[] }> {
  @Inject('db')
  declare private db: Pool

  getId() {
    return 'co2-hourly'
  }

  getCron() {
    return '1 * * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.MINUTE * 5
  }

  async getData() {
    const conn = await this.db.getConnection()
    try {
      return {
        today: await conn.query(
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
        date: DateTime.now().getDate(),
      }
    } finally {
      conn.release()
    }
  }
}
