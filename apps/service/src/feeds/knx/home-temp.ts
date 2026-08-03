import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'
import DateTime from '@/DateTime'

export const addBathroomFloorTempFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'home.temp.bathroom-floor',
    dataSources.getByIds(['bathroomFloorTempReading', 'indoorTempHistory']),
    ({ bathroomFloorTempReading, indoorTempHistory }) => ({
      reading: bathroomFloorTempReading,
      history: {
        date: DateTime.now().getDate(),
        today: indoorTempHistory.bathroomFloor,
      },
    }),
  )

export const addBedroomTempFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'home.temp.bedroom',
    dataSources.getByIds(['bedroomTempReading', 'bedroomTempSetpoint', 'indoorTempHistory']),
    ({ bedroomTempReading, bedroomTempSetpoint, indoorTempHistory }) => ({
      reading: bedroomTempReading,
      history: {
        date: DateTime.now().getDate(),
        today: indoorTempHistory.bedroom,
      },
      setpoint: bedroomTempSetpoint.value.toFixed(1),
    }),
  )

export const addLivingRoomTempFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'home.temp.livingroom',
    dataSources.getByIds(['livingRoomTempReading', 'livingRoomTempSetpoint', 'indoorTempHistory']),
    ({ livingRoomTempReading, livingRoomTempSetpoint, indoorTempHistory }) => ({
      reading: livingRoomTempReading,
      history: {
        date: DateTime.now().getDate(),
        today: indoorTempHistory.livingroom,
      },
      setpoint: livingRoomTempSetpoint.value.toFixed(1),
    }),
  )

export const addBathroomTempFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'home.temp.bathroom',
    dataSources.getByIds(['bathroomTempReading', 'bathroomTempSetpoint', 'indoorTempHistory']),
    ({ bathroomTempReading, bathroomTempSetpoint, indoorTempHistory }) => ({
      reading: bathroomTempReading,
      history: {
        date: DateTime.now().getDate(),
        today: indoorTempHistory.bathroom,
      },
      setpoint: bathroomTempSetpoint.value.toFixed(1),
    }),
  )
