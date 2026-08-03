import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Temp } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BedroomTempSetpointSource extends KnxPushReadingSource<typeof DPT_Value_Temp> {
  static getId(): string {
    return 'temp.bedroom.setpoint'
  }

  protected getGroupDef() {
    return knxSchema.home.temp.bedroom.setpoint
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.temp
  }
}
