import { CacheAgeUnit, DataSource, type DataSourceParams } from '@repo/feeds'
import { knxSchema } from '@repo/knx-schema'
import { DPT_ActiveEnergy, DPT_StartStop, KnxReading, type KnxLink } from 'js-knx'
import { Inject } from '@/di'

export class EnergyMeterSource extends DataSource<KnxReading<number>> {
  @Inject('knx')
  declare private readonly knx: KnxLink

  protected readonly intermediateReading: DPT_ActiveEnergy
  protected readonly reset: DPT_StartStop
  protected readonly start: DPT_StartStop
  protected readonly stop: DPT_StartStop

  public constructor(params: DataSourceParams<KnxReading<number>>) {
    super(params)

    this.intermediateReading = this.knx.group(knxSchema.home.energy.consumption.meter)
    this.reset = this.knx.group(knxSchema.home.energy.consumption.meterReset)
    this.start = this.knx.group(knxSchema.home.energy.consumption.meterStart)
    this.stop = this.knx.group(knxSchema.home.energy.consumption.meterStop)
    this.intermediateReading.onValue(reading => {
      void this.push(reading)
    })
  }

  public async handleCommand(command: string, _args: string): Promise<void> {
    switch (command) {
      case 'reset':
        await this.resetMeter()
        return
      case 'start':
        await this.startMeter()
        return
      case 'stop':
        await this.stopMeter()
        return
      case 'request-readings':
        await this.requestReadings()
        return
    }
  }

  public async resetMeter(): Promise<void> {
    await this.stop.write(1)
    await this.reset.write(1)
  }

  public async startMeter(): Promise<void> {
    await this.reset.write(1)
    await this.start.write(1)
    await this.start.write(1)
  }

  public async stopMeter(): Promise<void> {
    await this.stop.write(1)
  }

  public async requestReadings(): Promise<void> {
    await this.intermediateReading.requestValue()
  }

  static getId() {
    return 'energy.meter'
  }

  static isVolatile() {
    return true
  }

  static getCacheTTL() {
    return CacheAgeUnit.SECOND * 3
  }

  protected getSourceMetricType() {
    return 'knx' as const
  }

  protected async fetchData() {
    return await this.intermediateReading.read()
  }
}
