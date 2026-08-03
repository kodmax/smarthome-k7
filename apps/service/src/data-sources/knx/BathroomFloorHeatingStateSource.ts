import { knxSchema } from '@repo/knx-schema'
import { DPT_State } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class BathroomFloorHeatingStateSource extends KnxPushReadingSource<typeof DPT_State> {
  static getId(): string {
    return 'home.heating.bathroom.floor-heating'
  }

  protected getGroupDef() {
    return knxSchema.home.heating.bathroom.floorHeating
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.heating
  }
}
