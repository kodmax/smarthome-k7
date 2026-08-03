import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class LivingRoomTempSetpointSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  static getId(): string {
    return 'temp.livingroom.setpoint'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.livingRoom.setpoint
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.temp
  }
}
