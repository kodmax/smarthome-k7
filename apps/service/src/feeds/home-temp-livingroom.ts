import { Feeds } from '@repo/apollo-ws'
import type { KnxLink } from 'js-knx'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { knxSchema } from '../home.knx-schema'

export const addHomeTempLivingroomFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.temp.livingRoom

  feeds.addFeed(
    'home.temp.livingroom',
    {
      dining: knxTemp('temp.livingroom', knx.getDatapoint(schema.reading)),
      setpoint: knxTemp('temp.livingroom.setpoint', knx.getDatapoint(schema.setpoint)),
      indoorTempHistory,
    },
    ({ dining, indoorTempHistory, setpoint }) => ({
      history: indoorTempHistory['livingroom'],
      setpoint: setpoint.value.toFixed(1),
      ...dining,
    }),
  )
}
