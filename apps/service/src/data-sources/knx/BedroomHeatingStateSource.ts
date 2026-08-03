import { knxSchema } from '@repo/knx-schema'
import { DPT_State } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BedroomHeatingStateSource extends KnxPushReadingSource<typeof DPT_State> {
  static getId(): string {
    return 'home.heating.bedroom.water-heating'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bedroom.waterHeating
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.heating
  }
}
