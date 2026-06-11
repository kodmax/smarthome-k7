import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { DataPointAbstract, DPT_HVACMode, KnxReading } from 'js-knx'

export default (id: string, dp: DPT_HVACMode) => {
  const source: DataSourceDefinition<typeof dp extends DataPointAbstract<infer T> ? KnxReading<T> : never> = {
    id,
    volatile: true,

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
