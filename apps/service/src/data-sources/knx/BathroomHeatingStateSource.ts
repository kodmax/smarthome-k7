import { knxSchema } from '@repo/knx-schema'
import { DPT_State } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BathroomHeatingStateSource extends KnxPushReadingSource<typeof DPT_State> {
  static getId(): string {
    return 'home.heating.bathroom.water-heating'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bathroom.waterHeating
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.heating
  }
}
