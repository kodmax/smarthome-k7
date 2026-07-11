import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { DPT_ActiveEnergy, DPT_StartStop, KnxReading, type KnxLink } from 'js-knx'
import { Inject } from '../../di'

export class EnergyMeterSource extends DataSourceDefinition<KnxReading<number>> {
  @Inject('knx')
  declare private readonly knx: KnxLink

  declare private readonly intermediateReading: DPT_ActiveEnergy
  declare private readonly reset: DPT_StartStop
  declare private readonly start: DPT_StartStop
  declare private readonly stop: DPT_StartStop

  public constructor(push: (content: KnxReading<number>) => void, reportError: (e: Error) => void) {
    super(push, reportError)

    this.intermediateReading = this.knx.group({
      address: '5/2/2',
      DataType: DPT_ActiveEnergy,
    })
    this.reset = this.knx.group({
      address: '5/2/6',
      DataType: DPT_StartStop,
    })
    this.start = this.knx.group({
      address: '5/2/1',
      DataType: DPT_StartStop,
    })
    this.stop = this.knx.group({
      address: '5/2/4',
      DataType: DPT_StartStop,
    })
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

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.SECONDS) > 3
  }

  async getData() {
    return await this.intermediateReading.read()
  }
}
