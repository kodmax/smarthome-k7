import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BathroomTempSetpointSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  static getId(): string {
    return 'temp.bathroom.setpoint'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.bathroom.setpoint
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.temp
  }
}
