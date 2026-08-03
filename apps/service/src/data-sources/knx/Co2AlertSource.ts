import { knxSchema } from '@repo/knx-schema'
import { DPT_Alarm } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class Co2AlertSource extends KnxPushReadingSource<typeof DPT_Alarm> {
  protected getSourceId(): string {
    return 'home.air-quality.co2-alert'
  }

  protected getGroupDef() {
    return knxSchema.home.airQuality.co2.alert
  }

  protected getCacheTtlValue(): number {
    return knxPushCacheTtl.airQuality
  }
}
