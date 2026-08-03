import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BathroomTempReadingSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  protected getSourceId(): string {
    return 'temp.bathroom'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.bathroom.reading
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.temp
  }
}
