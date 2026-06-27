import { Feeds } from '@repo/apollo-ws'
import type { KnxLink } from 'js-knx'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { knxSchema } from '../home.knx-schema'

export const addHomeTempBathroomFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.temp.bathroom

  feeds.addFeed(
    'home.temp.bathroom',
    {
      bathroom: knxTemp('temp.bathroom', knx.getDatapoint(schema.reading)),
      setpoint: knxTemp('temp.bathroom.setpoint', knx.getDatapoint(schema.setpoint)),
      indoorTempHistory,
    },
    ({ bathroom, indoorTempHistory, setpoint }) => ({
      history: indoorTempHistory['bathroom'],
      setpoint: setpoint.value.toFixed(1),
      ...bathroom,
    }),
  )
}
