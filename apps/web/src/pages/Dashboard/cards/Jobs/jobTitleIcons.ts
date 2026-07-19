import { designTokens } from '@repo/design-tokens'

export const jobTitleIconSize = designTokens.icon.sizeXs - 4

export const jobTitleTrailingGroupStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  flexShrink: 0,
  gap: `${designTokens.space[1]}px`,
} as const
