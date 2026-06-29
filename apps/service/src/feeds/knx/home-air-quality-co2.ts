import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import type { KnxLink } from 'js-knx'
import { co2Hourly } from '@/data-sources'
import knxB1 from '@/data-sources/knx/b1'
import knxCo2 from '@/data-sources/knx/co2'

export const addHomeAirQualityCo2Feed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.airQuality.co2
  const co2Level = knxCo2('home.air-quality.co2', knx.getDatapoint(schema.reading))
  const co2Alert = knxB1('home.air-quality.co2-alert', knx.getDatapoint(schema.alert))

  feeds.addFeed('home.air-quality.co2', { co2Hourly, co2Level, co2Alert }, ({ co2Level, co2Hourly, co2Alert }) => ({
    reading: co2Level,
    history: co2Hourly,
    alert: co2Alert,
  }))
}
