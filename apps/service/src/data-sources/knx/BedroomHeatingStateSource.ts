import { knxSchema } from '@repo/knx-schema'
import { DPT_State } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BedroomHeatingStateSource extends KnxPushReadingSource<typeof DPT_State> {
  protected getSourceId(): string {
    return 'home.heating.bedroom.water-heating'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bedroom.waterHeating
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.heating
  }
}
