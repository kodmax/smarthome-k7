import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { Co2HistoryRecord } from '@repo/types'

export const source: DataSourceDefinition<{ date: string; today: Co2HistoryRecord[] }> = {
  cron: '1 * * * *',
  id: 'co2-hourly',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,
  script: async () => {
    const conn = await db.getConnection()
    try {
      return {
        today: await conn.query(
          `select
              hour(datetime) as hour,
              avg(ppm) as value
              from co2 where datetime >= ?
              group by hour(datetime)
              order by hour(datetime) ASC`,
          [new DateTime().getDate()],
        ),
        date: new DateTime().getDate(),
      }
    } finally {
      conn.release()
    }
  },
}
