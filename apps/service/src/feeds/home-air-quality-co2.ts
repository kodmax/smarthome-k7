import { Feeds } from '@repo/apollo-ws'
import { DPT_Alarm, type KnxLink } from 'js-knx'
import { co2Hourly } from '../data-sources'
import knxB1 from '../data-sources/knx/b1'
import knxCo2 from '../data-sources/knx/co2'
import { airQuality } from '../home.knx-schema'

export const addHomeAirQualityCo2Feed = (feeds: Feeds, knx: KnxLink): void => {
  const co2Level = knxCo2('home.air-quality.co2', knx.getDatapoint(airQuality.CO2.reading))
  const co2Alert = knxB1('home.air-quality.co2-alert', knx.getDatapoint({ address: '2/5/1', DataType: DPT_Alarm }))

  feeds.addFeed('home.air-quality.co2', { co2Hourly, co2Level, co2Alert }, ({ co2Level, co2Hourly, co2Alert }) => {
    return {
      alert: co2Alert,
      ...co2Level,
      ...co2Hourly,
    }
  })
}
