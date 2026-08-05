import { TemperatureIcon, ThermometerSunIcon, type StyledLucideIcon } from '@repo/assets'
import type { Translations } from '@/i18n/translations/types'
import { type CardHintIconVariant } from './cardHintIconPresets'
import { formatHintLine } from './formatHintLine'

export type TemperatureHintKey = 'tooHot' | 'tooCold'

export type TemperatureHintContext = {
  bedroomTempC: number
}

type HintExplanations = Translations['dashboard']['hintExplanations']

export type TemperatureHintPreset = {
  Icon: StyledLucideIcon
  variant: CardHintIconVariant
  description: (context: TemperatureHintContext, hintExplanations: HintExplanations) => string | string[]
}

export const temperatureHintOrder: TemperatureHintKey[] = ['tooHot', 'tooCold']

export const temperatureHints: Record<TemperatureHintKey, TemperatureHintPreset> = {
  tooHot: {
    Icon: ThermometerSunIcon,
    variant: 'warning',
    description: (context, hintExplanations) =>
      formatHintLine(hintExplanations.hotBedroom.line1, context.bedroomTempC, 1),
  },
  tooCold: {
    Icon: TemperatureIcon,
    variant: 'info',
    description: (context, hintExplanations) =>
      formatHintLine(hintExplanations.coldBedroom.line1, context.bedroomTempC, 1),
  },
}
