import { CoolingIcon, GlobeIcon, ThermometerSunIcon, UVIcon, WindIcon, type StyledLucideIcon } from '@repo/assets'
import type { Translations } from '@/i18n/translations/types'
import { type CardHintIconVariant } from './cardHintIconPresets'
import { formatHintLine } from './formatHintLine'

export type WeatherHintKey = 'strongWind' | 'hotOutdoor' | 'highUv' | 'frost' | 'poorOutdoorAir'

export type WeatherHintContext = {
  windSpeedMs: number
  outdoorTempC: number
  uv: number
  outdoorAqi: number
}

type HintExplanations = Translations['dashboard']['hintExplanations']

export type WeatherHintPreset = {
  Icon: StyledLucideIcon
  variant: CardHintIconVariant
  description: (context: WeatherHintContext, hintExplanations: HintExplanations) => string | string[]
}

export const weatherHintOrder: WeatherHintKey[] = ['strongWind', 'hotOutdoor', 'highUv', 'frost', 'poorOutdoorAir']

export const weatherHints: Record<WeatherHintKey, WeatherHintPreset> = {
  strongWind: {
    Icon: WindIcon,
    variant: 'info',
    description: (context, hintExplanations) =>
      formatHintLine(hintExplanations.strongWind.line1, context.windSpeedMs, 0),
  },
  hotOutdoor: {
    Icon: ThermometerSunIcon,
    variant: 'warning',
    description: (context, hintExplanations) =>
      formatHintLine(hintExplanations.hotOutdoor.line1, context.outdoorTempC, 0),
  },
  highUv: {
    Icon: UVIcon,
    variant: 'warning',
    description: (context, hintExplanations) => formatHintLine(hintExplanations.highUv.line1, context.uv, 1),
  },
  frost: {
    Icon: CoolingIcon,
    variant: 'info',
    description: (context, hintExplanations) => formatHintLine(hintExplanations.frost.line1, context.outdoorTempC, 0),
  },
  poorOutdoorAir: {
    Icon: GlobeIcon,
    variant: 'warning',
    description: (context, hintExplanations) =>
      formatHintLine(hintExplanations.poorOutdoorAir.line1, context.outdoorAqi, 0),
  },
}
