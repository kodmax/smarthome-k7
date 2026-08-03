import { knxSchema } from '@repo/knx-schema'
import { DPT_ActiveEnergy } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class EnergyMeterTotalReadingSource extends KnxPushReadingSource<typeof DPT_ActiveEnergy> {
  protected getSourceId(): string {
    return 'home.energy-consumption.meter-total-reading'
  }

  protected getGroupDef() {
    return knxSchema.home.energy.consumption.meterTotalReading
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.energy
  }
}
