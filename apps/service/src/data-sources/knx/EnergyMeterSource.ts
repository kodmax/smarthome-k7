import { CacheAgeUnit, DataSourceDefinition, FeedEvents } from '@repo/feeds'
import { knxSchema } from '@repo/knx-schema'
import { DPT_ActiveEnergy, DPT_StartStop, KnxReading, type KnxLink } from 'js-knx'
import { Inject } from '@/di'

export class EnergyMeterSource extends DataSourceDefinition<KnxReading<number>> {
  @Inject('knx')
  declare private readonly knx: KnxLink

  protected readonly intermediateReading: DPT_ActiveEnergy
  protected readonly reset: DPT_StartStop
  protected readonly start: DPT_StartStop
  protected readonly stop: DPT_StartStop

  public constructor(feedEvents: FeedEvents) {
    super(feedEvents)

    this.intermediateReading = this.knx.group(knxSchema.home.energy.consumption.meter)
    this.reset = this.knx.group(knxSchema.home.energy.consumption.meterReset)
    this.start = this.knx.group(knxSchema.home.energy.consumption.meterStart)
    this.stop = this.knx.group(knxSchema.home.energy.consumption.meterStop)
    this.intermediateReading.onValue(reading => {
      this.push(reading)
    })
  }

  async handleCommand(command: string): Promise<void> {
    switch (command) {
      case 'reset':
        await this.stop.write(1)
        await this.reset.write(1)
        return

      case 'start':
        await this.reset.write(1)
        await this.start.write(1)
        await this.start.write(1)
        return

      case 'stop':
        await this.stop.write(1)
        return

      case 'request-readings':
        await this.intermediateReading.requestValue()
        return
    }
  }

  getId() {
    return 'energy.meter'
  }

  isVolatile() {
    return true
  }

  getCacheTTL() {
    return CacheAgeUnit.SECOND * 3
  }

  getSourceMetricType() {
    return 'knx' as const
  }

  async getData() {
    return await this.intermediateReading.read()
  }
}
