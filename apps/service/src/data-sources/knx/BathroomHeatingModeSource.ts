import { knxSchema } from '@repo/knx-schema'
import { DPT_HVACMode } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BathroomHeatingModeSource extends KnxPushReadingSource<typeof DPT_HVACMode> {
  static getId(): string {
    return 'home.heating.hvacmode.bathroom'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bathroom.hvacMode
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.heating
  }
}
