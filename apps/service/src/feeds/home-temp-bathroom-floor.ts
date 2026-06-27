import { Feeds } from '@repo/apollo-ws'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { temp } from '../home.knx-schema'
import type { KnxLink } from 'js-knx'

export const addHomeTempBathroomFloorFeed = (feeds: Feeds, knx: KnxLink): void => {
  feeds.addFeed(
    'home.temp.bathroom-floor',
    {
      bathroomFloor: knxTemp('temp.bathroom-floor', knx.getDatapoint(temp['Podloga lazienka temperatura'])),
      indoorTempHistory,
    },
    ({ bathroomFloor, indoorTempHistory }) => ({
      history: indoorTempHistory['bathroomFloor'],
      ...bathroomFloor,
    }),
  )
}
