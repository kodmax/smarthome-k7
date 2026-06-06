import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { DataPointAbstract, KnxReading } from 'js-knx'

type KnxType<DP extends DataPointAbstract<any>> = DP extends DataPointAbstract<infer T> ? KnxReading<T> : never

const KnxDataSource = <DP extends DataPointAbstract<any>>(id: string, dp: DP): DataSourceDefinition<KnxType<DP>> => {
  return {
    volatile: true,
    id,

    expired: snapshot => snapshot.age(CacheAgeUnit.SECONDS) > 60,

    script: async () => {
      return (await dp.read()) as KnxType<DP>
    },

    push: push => {
      dp.addValueListener(reading => {
        push(reading as KnxType<DP>)
      })
    },
  }
}

export default KnxDataSource
