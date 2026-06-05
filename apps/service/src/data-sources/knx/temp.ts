import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { DataPointAbstract, DPT_Value_Temp, KnxReading } from 'js-knx'

export default (id: string, dp: DPT_Value_Temp) => {
    const source: DataSourceDefinition<typeof dp extends DataPointAbstract<infer T> ? KnxReading<T> : never> = {
        id,
        volatile: true,

        expired: snapshot => snapshot.age(CacheAgeUnit.SECONDS) > 60,

        script: async () => {
            return await dp.read()
        },

        push: (push, cmd, err) => {
            dp.addValueListener(reading => {
                push(reading)
            })
        }
    }

    return source
}
