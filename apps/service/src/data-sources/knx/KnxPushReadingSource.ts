import { CacheAgeUnit, DataSource, type DataSourceParams } from '@repo/feeds'
import type { DataPointAbstract, DatapointConstructor, KnxReading, KnxLink } from 'js-knx'
import { Inject } from '@/di'

export type KnxGroupDef<D extends DatapointConstructor<DataPointAbstract<number>>> = {
  address: string
  DataType: D
}

export abstract class KnxPushReadingSource<
  D extends DatapointConstructor<DataPointAbstract<number>>,
> extends DataSource<KnxReading<number>> {
  @Inject('knx')
  declare protected readonly knx: KnxLink

  protected readonly dp: InstanceType<D>

  public constructor(params: DataSourceParams<KnxReading<number>>) {
    super(params)

    this.dp = this.knx.group(this.getGroupDef()) as InstanceType<D>
    this.dp.addWriteListener(reading => {
      void this.push(reading)
    })
  }

  public static isVolatile(): boolean {
    return true
  }

  protected abstract getGroupDef(): KnxGroupDef<D>

  protected getSourceMetricType() {
    return 'knx' as const
  }

  protected async fetchData(): Promise<KnxReading<number>> {
    return await this.dp.read()
  }
}

export const knxPushCacheTtl = {
  heating: CacheAgeUnit.SECOND * 60,
  temp: CacheAgeUnit.SECOND * 60,
  airQuality: CacheAgeUnit.SECOND * 3,
  energy: CacheAgeUnit.SECOND * 3,
} as const
