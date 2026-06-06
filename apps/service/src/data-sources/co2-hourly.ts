import { DataSourceDefinition, CacheAgeUnit } from 'apollo-ws'
import DateTime from '../DateTime'
import db from '../db'

type HourConsumption = {
  hourly_consumption: number
  hour: string
}

export const source: DataSourceDefinition<{ date: string; today: HourConsumption[] }> = {
  cron: '1 * * * *',
  id: 'co2-hourly',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,
  script: async () => {
    const conn = await db.getConnection()
    try {
      return {
        // average: await conn.query(
        //     'select from_unixtime(max(unix_timestamp(datetime))) as datetime as hour, avg(ppm) as value from co2 where datetime >= ? group by hour(datetime);',
        //     [new DateTime(-30, CacheAgeUnit.DAYS).getDate()]
        // ),
        today: await conn.query('select datetime, ppm as value from co2 where datetime >= ?', [
          new DateTime().getDate(),
        ]),
        date: new DateTime().getDate(),
      }
    } finally {
      await conn.end()
    }
  },
}
