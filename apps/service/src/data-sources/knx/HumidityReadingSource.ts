import { knxSchema } from '@repo/knx-schema'
import { DPT_Value_Humidity } from 'js-knx'
import { KnxPushReadingSource, knxPushCacheTtl } from './KnxPushReadingSource'

export class HumidityReadingSource extends KnxPushReadingSource<typeof DPT_Value_Humidity> {
  static getId(): string {
    return 'home.air-quality.humidity'
  }

  protected getGroupDef() {
    return knxSchema.home.airQuality.humidity.reading
  }

  static getCacheTTL(): number {
    return knxPushCacheTtl.airQuality
  }
}
