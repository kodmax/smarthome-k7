import { knxSchema } from '@repo/knx-schema'
import { DPT_HVACMode } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class LivingRoomHeatingModeSource extends KnxPushReadingSource<typeof DPT_HVACMode> {
  protected getSourceId(): string {
    return 'home.heating.hvacmode.living-room'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.livingRoom.hvacMode
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.heating
  }
}
