import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { TemperatureData } from '@repo/types'
import { DataSourceRegistryType } from '@/data-sources'

export const addHeatingFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'heating',
    dataSources.getByIds([
      'bathroomHeatingState',
      'bathroomFloorHeatingState',
      'livingRoomHeatingState',
      'bedroomHeatingState',
      'livingRoomHeatingMode',
      'bathroomHeatingMode',
      'bedroomHeatingMode',
    ]),
    ({
      bathroomHeatingState,
      bathroomFloorHeatingState,
      livingRoomHeatingState,
      bedroomHeatingState,
      livingRoomHeatingMode,
      bathroomHeatingMode,
      bedroomHeatingMode,
    }): TemperatureData => ({
      status: {
        bathroom: bathroomHeatingState,
        bathroomFloor: bathroomFloorHeatingState,
        bedroom: bedroomHeatingState,
        livingroom: livingRoomHeatingState,
      },
      mode: {
        livingroom: livingRoomHeatingMode,
        bathroom: bathroomHeatingMode,
        bedroom: bedroomHeatingMode,
      },
    }),
  )
