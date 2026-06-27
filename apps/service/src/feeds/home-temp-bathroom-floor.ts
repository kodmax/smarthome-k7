import { Feeds } from '@repo/apollo-ws'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { knxSchema } from '../home.knx-schema'
import type { KnxLink } from 'js-knx'

export const addHomeTempBathroomFloorFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.temp.bathroomFloor

  feeds.addFeed(
    'home.temp.bathroom-floor',
    {
      bathroomFloor: knxTemp('temp.bathroom-floor', knx.getDatapoint(schema.reading)),
      indoorTempHistory,
    },
    ({ bathroomFloor, indoorTempHistory }) => ({
      history: indoorTempHistory['bathroomFloor'],
      ...bathroomFloor,
    }),
  )
}
