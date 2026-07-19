import { CacheAgeUnit, DataSourceDefinition, DataSourceDefinitionClass } from '@repo/apollo-ws'
import { DPT_HVACMode, KnxReading } from 'js-knx'

export default (id: string, dp: DPT_HVACMode): DataSourceDefinitionClass<KnxReading<number>> => {
  return class KnxHvacModeSource extends DataSourceDefinition<KnxReading<number>> {
    public constructor(push: (content?: KnxReading<number>) => void, reportError: (e: Error) => void) {
      super(push, reportError)
      dp.addWriteListener(reading => {
        this.push(reading)
      })
    }

    public getId(): string {
      return id
    }

    public isVolatile(): boolean {
      return true
    }

    public isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }): boolean {
      return snapshot.age(CacheAgeUnit.SECONDS) > 60
    }

    public async getData(): Promise<KnxReading<number>> {
      return await dp.read()
    }
  }
}
