import { useMemo } from 'react'
import { useFeed } from '@repo/feed-client'
import { Co2Data, HumidityData, WeatherFeed } from '@repo/types'
import { indoorHints, type IndoorHintKey, type IndoorHintPreset } from '@/app/hints'
import { useTranslations } from '@/i18n'
import { indoorAirHints } from './indoorAirHints'

export type IndoorAirHintItem = {
  key: IndoorHintKey
  Icon: IndoorHintPreset['Icon']
  variant: IndoorHintPreset['variant']
  title: string
  description: string | string[]
}

export const useIndoorAirHints = (): IndoorAirHintItem[] => {
  const weatherFeed = useFeed<WeatherFeed>('weather')
  const co2Feed = useFeed<Co2Data>('home.air-quality.co2')
  const humidityFeed = useFeed<HumidityData>('home.air-quality.humidity')
  const { t } = useTranslations()

  return useMemo(() => {
    const labels = t.dashboard.indoor
    const hintExplanations = t.dashboard.hintExplanations
    const hints = indoorAirHints({
      co2Ppm: co2Feed?.reading.value,
      indoorHumidity: humidityFeed?.reading.value,
      outdoorTempC: weatherFeed?.instant.temp,
      outdoorAqi: weatherFeed?.aq.aqi,
      windSpeedMs: weatherFeed?.instant.wind.speed,
    })

    return hints.map(key => {
      const preset = indoorHints[key]

      return {
        key,
        Icon: preset.Icon,
        variant: preset.variant,
        title: labels.ventilate[key],
        description: preset.description(hintExplanations),
      }
    })
  }, [co2Feed, humidityFeed, t, weatherFeed])
}
