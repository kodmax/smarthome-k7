import { useMemo } from 'react'
import { useFeed } from '@repo/feed-client'
import { Co2Data, HumidityData, WeatherFeed } from '@repo/types'
import { ventilateDecision, type VentilateResult } from './ventilateDecision'

export const useVentilateDecision = (): VentilateResult => {
  const weatherFeed = useFeed<WeatherFeed>('weather')
  const co2Feed = useFeed<Co2Data>('home.air-quality.co2')
  const humidityFeed = useFeed<HumidityData>('home.air-quality.humidity')

  return useMemo(
    () =>
      ventilateDecision({
        co2Ppm: co2Feed?.reading.value,
        indoorHumidity: humidityFeed?.reading.value,
        outdoorTempC: weatherFeed?.instant.temp,
        outdoorHumidity: weatherFeed?.instant.humidity,
        outdoorAqi: weatherFeed?.aq.aqi,
        windSpeedMs: weatherFeed?.instant.wind.speed,
      }),
    [co2Feed, humidityFeed, weatherFeed],
  )
}
