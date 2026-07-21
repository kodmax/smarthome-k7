import { CacheAgeUnit, DataSourceDefinition, DataSourceDefinitionClass } from '@repo/apollo-ws'
import { DPT_ActiveEnergy, KnxReading } from 'js-knx'

export default (id: string, dp: DPT_ActiveEnergy): DataSourceDefinitionClass<KnxReading<number>> => {
  return class KnxEnergySource extends DataSourceDefinition<KnxReading<number>> {
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

    public getCacheTTL(): number {
      return CacheAgeUnit.SECONDS * 3
    }

    public async getData(): Promise<KnxReading<number>> {
      return await dp.read()
    }
  }
}
