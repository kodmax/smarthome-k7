import { designTokens } from '@repo/design-tokens'
import type { StyledIconOptions } from './createStyledIcon'

const { color } = designTokens

export const iconStyles = {
  energy: { color: color.energy, glow: 'default' },
  air: { color: color.air, glow: 'default' },
  temperature: { color: color.temperature, glow: 'default' },
  weather: { color: color.info, glow: 'default' },
  media: { color: color.media, glow: 'default' },
  warning: { color: color.warning, glow: 'default' },
  neutral: { color: color.textPrimary, glow: 'soft' },
  muted: { color: color.textSecondary, glow: 'soft' },
  link: { color: color.primary, glow: 'off' },
} as const satisfies Record<string, StyledIconOptions>
