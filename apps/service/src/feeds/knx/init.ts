import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import {
  BathroomFloorHeatingStateSource,
  BathroomFloorTempReadingSource,
  BathroomHeatingModeSource,
  BathroomHeatingStateSource,
  BathroomTempReadingSource,
  BathroomTempSetpointSource,
  BedroomHeatingModeSource,
  BedroomHeatingStateSource,
  BedroomTempReadingSource,
  BedroomTempSetpointSource,
  Co2AlertSource,
  Co2ReadingSource,
  Co2HourlySource,
  EnergyCostSource,
  EnergyHourlySource,
  EnergyMeterSource,
  EnergyMeterTotalReadingSource,
  EnergyPowerDrawSource,
  HomeLightsSource,
  HumidityHourlySource,
  HumidityReadingSource,
  IndoorTempHistorySource,
  LivingRoomHeatingModeSource,
  LivingRoomHeatingStateSource,
  LivingRoomTempReadingSource,
  LivingRoomTempSetpointSource,
  DataSourceRegistryType,
} from '@/data-sources'
import { addEnergyFeed } from './energy'
import { addHeatingFeed } from './heating'
import { addHomeAirQualityCo2Feed } from './home-air-quality-co2'
import { addHomeAirQualityHumidityFeed } from './home-air-quality-humidity'
import { addBathroomFloorTempFeed, addBathroomTempFeed, addBedroomTempFeed, addLivingRoomTempFeed } from './home-temp'
import { addLightsFeed } from './lights'

export const initKnxFeeds = async (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => {
  await dataSources.add('bathroomHeatingState', BathroomHeatingStateSource)
  await dataSources.add('bathroomFloorHeatingState', BathroomFloorHeatingStateSource)
  await dataSources.add('livingRoomHeatingState', LivingRoomHeatingStateSource)
  await dataSources.add('bedroomHeatingState', BedroomHeatingStateSource)
  await dataSources.add('livingRoomHeatingMode', LivingRoomHeatingModeSource)
  await dataSources.add('bathroomHeatingMode', BathroomHeatingModeSource)
  await dataSources.add('bedroomHeatingMode', BedroomHeatingModeSource)

  await dataSources.add('energyMeterTotalReading', EnergyMeterTotalReadingSource)
  await dataSources.add('energyPowerDraw', EnergyPowerDrawSource)
  await dataSources.add('energyMeter', EnergyMeterSource)
  await dataSources.add('energyCost', EnergyCostSource)
  await dataSources.add('energyHourlyConsumption', EnergyHourlySource)

  await dataSources.add('homeLights', HomeLightsSource)

  await dataSources.add('co2Hourly', Co2HourlySource)
  await dataSources.add('co2Reading', Co2ReadingSource)
  await dataSources.add('co2Alert', Co2AlertSource)

  await dataSources.add('humidityHourly', HumidityHourlySource)
  await dataSources.add('humidityReading', HumidityReadingSource)

  await dataSources.add('bathroomFloorTempReading', BathroomFloorTempReadingSource)
  await dataSources.add('bedroomTempReading', BedroomTempReadingSource)
  await dataSources.add('bedroomTempSetpoint', BedroomTempSetpointSource)
  await dataSources.add('livingRoomTempReading', LivingRoomTempReadingSource)
  await dataSources.add('livingRoomTempSetpoint', LivingRoomTempSetpointSource)
  await dataSources.add('bathroomTempReading', BathroomTempReadingSource)
  await dataSources.add('bathroomTempSetpoint', BathroomTempSetpointSource)
  await dataSources.add('indoorTempHistory', IndoorTempHistorySource)

  await Promise.all([
    addHeatingFeed(feeds, dataSources),
    addEnergyFeed(feeds, dataSources),
    addLightsFeed(feeds, dataSources),
    addHomeAirQualityCo2Feed(feeds, dataSources),
    addHomeAirQualityHumidityFeed(feeds, dataSources),
    addBathroomFloorTempFeed(feeds, dataSources),
    addBedroomTempFeed(feeds, dataSources),
    addLivingRoomTempFeed(feeds, dataSources),
    addBathroomTempFeed(feeds, dataSources),
  ])
}
