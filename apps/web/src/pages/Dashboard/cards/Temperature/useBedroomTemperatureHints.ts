import { useMemo } from 'react'
import { useFeed } from '@repo/feed-client'
import { HomeTempFeedData } from '@repo/types'
import { temperatureHints, type TemperatureHintKey, type TemperatureHintPreset } from '@/app/hints'
import type { Translations } from '@/i18n/translations/types'
import { useTranslations } from '@/i18n'
import { bedroomTemperatureHints } from './bedroomTemperatureHints'

export type BedroomTemperatureHintItem = {
  key: TemperatureHintKey
  Icon: TemperatureHintPreset['Icon']
  variant: TemperatureHintPreset['variant']
  title: string
  description: string | string[]
}

const temperatureHintTitles: Record<TemperatureHintKey, keyof Translations['dashboard']['temperature']> = {
  tooHot: 'hotBedroom',
  tooCold: 'coldBedroom',
}

export const useBedroomTemperatureHints = (): BedroomTemperatureHintItem[] => {
  const bedroomFeed = useFeed<HomeTempFeedData>('home.temp.bedroom')
  const { t } = useTranslations()

  return useMemo(() => {
    const labels = t.dashboard.temperature
    const hintExplanations = t.dashboard.hintExplanations
    const { hints, context } = bedroomTemperatureHints({
      bedroomTempC: bedroomFeed?.reading.value,
    })

    if (context === undefined) {
      return []
    }

    return hints.map(key => {
      const preset = temperatureHints[key]
      const titleKey = temperatureHintTitles[key]

      return {
        key,
        Icon: preset.Icon,
        variant: preset.variant,
        title: labels[titleKey],
        description: preset.description(context, hintExplanations),
      }
    })
  }, [bedroomFeed, t])
}
