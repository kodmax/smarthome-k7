import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { DataPointAbstract, DPT_Generic_B1, KnxReading } from 'js-knx'

export default (id: string, dp: DPT_Generic_B1) => {
  const source: DataSourceDefinition<typeof dp extends DataPointAbstract<infer T> ? KnxReading<T> : never> = {
    volatile: true,
    id,

    expired: snapshot => snapshot.age(CacheAgeUnit.SECONDS) > 60,

    script: async () => {
      return await dp.read()
    },

    push: push => {
      dp.addValueListener(reading => {
        push(reading)
      })
    },
  }

  return source
}
