import { useMemo } from 'react'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { weatherHints, type WeatherHintKey, type WeatherHintPreset } from '@/app/hints'
import { useTranslations } from '@/i18n'
import { currentWeatherHints } from './currentWeatherHints'

export type CurrentWeatherHintItem = {
  key: WeatherHintKey
  Icon: WeatherHintPreset['Icon']
  variant: WeatherHintPreset['variant']
  title: string
  description: string | string[]
}

export const useCurrentWeatherHints = (): CurrentWeatherHintItem[] => {
  const feed = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()

  return useMemo(() => {
    const labels = t.dashboard.weather
    const hintExplanations = t.dashboard.hintExplanations
    const { hints, context } = currentWeatherHints({
      windSpeedMs: feed?.instant.wind.speed,
      outdoorTempC: feed?.instant.temp,
      uv: feed?.instant.uv,
      outdoorAqi: feed?.aq.aqi,
    })

    if (context === undefined) {
      return []
    }

    return hints.map(key => {
      const preset = weatherHints[key]

      return {
        key,
        Icon: preset.Icon,
        variant: preset.variant,
        title: labels[key],
        description: preset.description(context, hintExplanations),
      }
    })
  }, [feed, t])
}
