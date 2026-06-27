import { Feeds } from '@repo/apollo-ws'
import type { KnxLink } from 'js-knx'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { knxSchema } from '../home.knx-schema'

export const addHomeTempBedroomFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.temp.bedroom

  feeds.addFeed(
    'home.temp.bedroom',
    {
      bedroomHal: knxTemp('temp.bedroom', knx.getDatapoint(schema.reading)),
      setpoint: knxTemp('temp.bedroom.setpoint', knx.getDatapoint(schema.setpoint)),
      indoorTempHistory,
    },
    ({ bedroomHal, indoorTempHistory, setpoint }) => ({
      history: indoorTempHistory['bedroom'],
      setpoint: setpoint.value.toFixed(1),
      ...bedroomHal,
    }),
  )
}
