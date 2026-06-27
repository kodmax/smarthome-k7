import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { KnxReading, DPT_Value_AirQuality, DataPointAbstract } from 'js-knx'
import DateTime from '../../DateTime'
import db from '../../db'

export default (id: string, dp: DPT_Value_AirQuality) => {
  const source: DataSourceDefinition<typeof dp extends DataPointAbstract<infer T> ? KnxReading<T> : never> = {
    id,
    volatile: true,

    expired: snapshot => snapshot.age(CacheAgeUnit.SECONDS) > 3,

    script: async () => {
      return await dp.read()
    },

    push: (push, _command, err) => {
      dp.addValueListener(async reading => {
        push(reading)

        try {
          const datetime = new DateTime()
          const conn = await db.getConnection()

          try {
            await conn.query('insert into co2 (datetime, ppm) values (?, ?)', [datetime.getDateTime(), reading.value])
          } finally {
            conn.release()
          }
        } catch (e) {
          err(e instanceof Error ? e : new Error('Unknown error'))
        }
      })
    },
  }

  return source
}
