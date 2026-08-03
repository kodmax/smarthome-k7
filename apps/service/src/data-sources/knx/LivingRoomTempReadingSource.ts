import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class LivingRoomTempReadingSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  protected getSourceId(): string {
    return 'temp.livingroom'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.livingRoom.reading
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.temp
  }
}
