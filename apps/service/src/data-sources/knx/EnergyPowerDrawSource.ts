import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Power } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class EnergyPowerDrawSource extends KnxPushReadingSource<typeof DPT_Value_Power> {
  protected getSourceId(): string {
    return 'home.power-draw'
  }

  protected getGroupDef() {
    return knxSchema.home.energy.powerDraw
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.energy
  }
}
