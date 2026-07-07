import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { Co2HistoryRecord } from '@repo/types'

export class HumidityHourlySource extends DataSourceDefinition<{ date: string; today: Co2HistoryRecord[] }> {
  getId() {
    return 'humidity-hourly'
  }

  getCron() {
    return '1 * * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 5
  }

  async getData() {
    const conn = await db.getConnection()
    try {
      return {
        today: await conn.query(
          `select
              hour(timestamp) as hour,
              avg(reading_value) as value
              from readings
              where timestamp >= ?
                and reading_name = 'humidity'
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
