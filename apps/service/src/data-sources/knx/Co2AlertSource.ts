import { knxSchema } from '@repo/knx-schema'
import { DPT_Alarm } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class Co2AlertSource extends KnxPushReadingSource<typeof DPT_Alarm> {
  static getId(): string {
    return 'home.air-quality.co2-alert'
  }

  protected getGroupDef() {
    return knxSchema.home.airQuality.co2.alert
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.airQuality
  }
}
