import { CvSource } from './cv'
import { Co2HourlySource } from './co2-hourly'
import { EnergyCostSource, EnergyHourlySource } from './energy'
import { HumidityHourlySource } from './humidity-hourly'
import { IndoorTempHistorySource } from './indoor-temp-history'
import { JobAdsSource } from './job-ads'
import { JobMarketInsightSource } from './job-market-insight'
import { MySkillsSource } from './my-skills'
import { NewsSource } from './news'
import { SentryTestSource } from './sentry-test'
import { CnbcForexSource, CnbcMarketIndicesSource, NasdaqMarketDataSource, YahooMarketDataSource } from './stock-market'
import { TorrentSource } from './the-pirate-bay'
import { TransmissionSource } from './transmission'
import { WeatherSource } from './weather'
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
  EnergyMeterSource,
  EnergyMeterTotalReadingSource,
  EnergyPowerDrawSource,
  HomeLightsSource,
  HumidityReadingSource,
  LivingRoomHeatingModeSource,
  LivingRoomHeatingStateSource,
  LivingRoomTempReadingSource,
  LivingRoomTempSetpointSource,
} from './knx'

export type DataSourceRegistryType = {
  weather: typeof WeatherSource
  nasdaqMarketData: typeof NasdaqMarketDataSource
  yahooMarketData: typeof YahooMarketDataSource
  cnbcMarketIndices: typeof CnbcMarketIndicesSource
  cnbcForex: typeof CnbcForexSource
  news: typeof NewsSource
  jobAds: typeof JobAdsSource
  mySkills: typeof MySkillsSource
  jobMarketInsight: typeof JobMarketInsightSource
  cv: typeof CvSource
  torrents: typeof TorrentSource
  transmission: typeof TransmissionSource
  sentryTest: typeof SentryTestSource
  bathroomHeatingState: typeof BathroomHeatingStateSource
  bathroomFloorHeatingState: typeof BathroomFloorHeatingStateSource
  livingRoomHeatingState: typeof LivingRoomHeatingStateSource
  bedroomHeatingState: typeof BedroomHeatingStateSource
  livingRoomHeatingMode: typeof LivingRoomHeatingModeSource
  bathroomHeatingMode: typeof BathroomHeatingModeSource
  bedroomHeatingMode: typeof BedroomHeatingModeSource
  energyMeterTotalReading: typeof EnergyMeterTotalReadingSource
  energyPowerDraw: typeof EnergyPowerDrawSource
  energyMeter: typeof EnergyMeterSource
  energyCost: typeof EnergyCostSource
  energyHourlyConsumption: typeof EnergyHourlySource
  homeLights: typeof HomeLightsSource
  co2Hourly: typeof Co2HourlySource
  co2Reading: typeof Co2ReadingSource
  co2Alert: typeof Co2AlertSource
  humidityHourly: typeof HumidityHourlySource
  humidityReading: typeof HumidityReadingSource
  bathroomFloorTempReading: typeof BathroomFloorTempReadingSource
  bedroomTempReading: typeof BedroomTempReadingSource
  bedroomTempSetpoint: typeof BedroomTempSetpointSource
  livingRoomTempReading: typeof LivingRoomTempReadingSource
  livingRoomTempSetpoint: typeof LivingRoomTempSetpointSource
  bathroomTempReading: typeof BathroomTempReadingSource
  bathroomTempSetpoint: typeof BathroomTempSetpointSource
  indoorTempHistory: typeof IndoorTempHistorySource
}
