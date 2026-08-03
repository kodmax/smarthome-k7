import { knxSchema } from '@repo/knx-schema'
import { DPT_HVACMode } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BedroomHeatingModeSource extends KnxPushReadingSource<typeof DPT_HVACMode> {
  protected getSourceId(): string {
    return 'home.heating.hvacmode.bedroom'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bedroom.hvacMode
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.heating
  }
}
