import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { KnxReading, DPT_Value_AirQuality, DataPointAbstract } from 'js-knx'

export default (id: string, dp: DPT_Value_AirQuality) => {
  const source: DataSourceDefinition<typeof dp extends DataPointAbstract<infer T> ? KnxReading<T> : never> = {
    id,
    volatile: true,

    expired: snapshot => snapshot.age(CacheAgeUnit.SECONDS) > 3,

    script: async () => {
      return await dp.read()
    },

    push: (push) => {
      dp.addValueListener(async reading => {
        push(reading)
      })
    },
  }

  return source
}
