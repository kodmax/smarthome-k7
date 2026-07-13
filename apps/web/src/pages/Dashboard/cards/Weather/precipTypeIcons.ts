import {
  AlertIcon,
  HailIcon,
  HumidityIcon,
  MixedPrecipIcon,
  RainIcon,
  SleetIcon,
  SnowIcon,
  type StyledLucideIcon,
} from '@repo/assets'
import type { PrecipType } from '@repo/types'

export const PRECIP_HINT_TYPES = ['rain', 'snow', 'hail', 'sleet', 'ice', 'mixed'] as const satisfies ReadonlyArray<
  Exclude<PrecipType, 'none'>
>

export type PrecipHintType = (typeof PRECIP_HINT_TYPES)[number]

const precipTypeIcons: Record<Exclude<PrecipType, 'none'>, StyledLucideIcon> = {
  rain: RainIcon,
  snow: SnowIcon,
  hail: HailIcon,
  sleet: SleetIcon,
  ice: AlertIcon,
  mixed: MixedPrecipIcon,
}

export const precipTypeIcon = (precipType: PrecipType): StyledLucideIcon =>
  precipType === 'none' ? HumidityIcon : precipTypeIcons[precipType]

export const precipHintVariant = (precipType: PrecipHintType): 'info' | 'warning' =>
  precipType === 'hail' ? 'warning' : 'info'
