import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_AirQuality } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class Co2ReadingSource extends KnxPushReadingSource<typeof DPT_Value_AirQuality> {
  static getId(): string {
    return 'home.air-quality.co2'
  }

  protected getGroupDef() {
    return knxSchema.home.airQuality.co2.reading
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.airQuality
  }
}
