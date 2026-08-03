import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Power } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class EnergyPowerDrawSource extends KnxPushReadingSource<typeof DPT_Value_Power> {
  static getId(): string {
    return 'home.power-draw'
  }

  protected getGroupDef() {
    return knxSchema.home.energy.powerDraw
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.energy
  }
}
