import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BathroomFloorTempReadingSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  protected getSourceId(): string {
    return 'temp.bathroom-floor'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.bathroomFloor.reading
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.temp
  }
}
