import { CacheAgeUnit, DataSourceDefinition, DataSourceDefinitionClass } from '@repo/apollo-ws'
import { DPT_Generic_B1, KnxReading } from 'js-knx'

export default (id: string, dp: DPT_Generic_B1): DataSourceDefinitionClass<KnxReading<number>> => {
  return class KnxB1Source extends DataSourceDefinition<KnxReading<number>> {
    protected init(): void {
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
