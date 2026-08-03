import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class LivingRoomTempSetpointSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  protected getSourceId(): string {
    return 'temp.livingroom.setpoint'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.livingRoom.setpoint
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.temp
  }
}
