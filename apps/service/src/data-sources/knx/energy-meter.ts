import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { DPT_ActiveEnergy, DPT_StartStop, KnxReading, type KnxLink } from 'js-knx'
import { Inject } from '../../di'

export class EnergyMeterSource extends DataSourceDefinition<KnxReading<number>> {
  @Inject('knx')
  declare private knx: KnxLink

  declare private intermediateReading: DPT_ActiveEnergy
  declare private start: DPT_StartStop
  declare private stop: DPT_StartStop

  protected init(): void {
    this.intermediateReading = this.knx.group({
      address: '5/2/2',
      DataType: DPT_ActiveEnergy,
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
      case 'start':
        await this.stop.write(1)
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
