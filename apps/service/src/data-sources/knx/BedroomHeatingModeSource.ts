import { knxSchema } from '@repo/knx-schema'
import { DPT_HVACMode } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BedroomHeatingModeSource extends KnxPushReadingSource<typeof DPT_HVACMode> {
  static getId(): string {
    return 'home.heating.hvacmode.bedroom'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bedroom.hvacMode
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.heating
  }
}
