import { AlertIcon, HumidityIcon, type StyledLucideIcon } from '@repo/assets'
import type { Translations } from '@/i18n/translations/types'
import { type CardHintIconVariant } from './cardHintIconPresets'

export type IndoorHintKey = 'highCo2' | 'elevatedCo2' | 'highHumidity'

type HintExplanations = Translations['dashboard']['hintExplanations']

export type IndoorHintPreset = {
  Icon: StyledLucideIcon
  variant: CardHintIconVariant
  description: (hintExplanations: HintExplanations) => string | string[]
}

export const indoorHintOrder: IndoorHintKey[] = ['highCo2', 'elevatedCo2', 'highHumidity']

export const indoorHints: Record<IndoorHintKey, IndoorHintPreset> = {
  highCo2: {
    Icon: AlertIcon,
    variant: 'warning',
    description: hintExplanations => hintExplanations.ventilate.highCo2,
  },
  elevatedCo2: {
    Icon: AlertIcon,
    variant: 'info',
    description: hintExplanations => hintExplanations.ventilate.elevatedCo2,
  },
  highHumidity: {
    Icon: HumidityIcon,
    variant: 'info',
    description: hintExplanations => hintExplanations.ventilate.highHumidity,
  },
}
