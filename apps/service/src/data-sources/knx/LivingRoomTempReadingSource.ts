import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class LivingRoomTempReadingSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  static getId(): string {
    return 'temp.livingroom'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.livingRoom.reading
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.temp
  }
}
