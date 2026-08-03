import { CacheAgeUnit, DataSourceDefinition } from '@repo/feeds'
import type { DataPointAbstract, DatapointConstructor, KnxReading, KnxLink } from 'js-knx'
import { Inject } from '@/di'

export type KnxGroupDef<D extends DatapointConstructor<DataPointAbstract<number>>> = {
  address: string
  DataType: D
}

export abstract class KnxPushReadingSource<
  D extends DatapointConstructor<DataPointAbstract<number>>,
> extends DataSourceDefinition<KnxReading<number>> {
  @Inject('knx')
  declare protected readonly knx: KnxLink

  protected readonly dp: InstanceType<D>

  public constructor(push: (content?: KnxReading<number>) => void, reportError: (e: Error) => void) {
    super(push, reportError)

    this.dp = this.knx.group(this.getGroupDef()) as InstanceType<D>
    this.dp.addWriteListener(reading => {
      this.push(reading)
    })
  }

  protected abstract getSourceId(): string
  protected abstract getGroupDef(): KnxGroupDef<D>
  protected abstract getCacheTtlValue(): number

  public getId(): string {
    return this.getSourceId()
  }

  public isVolatile(): boolean {
    return true
  }

  public getCacheTTL(): number {
    return this.getCacheTtlValue()
  }

  public getSourceMetricType() {
    return 'knx' as const
  }

  public async getData(): Promise<KnxReading<number>> {
    return await this.dp.read()
  }
}

export const knxPushCacheTtl = {
  heating: CacheAgeUnit.SECOND * 60,
  temp: CacheAgeUnit.SECOND * 60,
  airQuality: CacheAgeUnit.SECOND * 3,
  energy: CacheAgeUnit.SECOND * 3,
} as const
