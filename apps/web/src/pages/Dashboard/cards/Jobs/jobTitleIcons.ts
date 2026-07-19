import { designTokens } from '@repo/design-tokens'

export const jobTitleIconSize = designTokens.icon.sizeXs - 4

export const jobTitleTrailingGroupStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  marginLeft: `${designTokens.space[1]}px`,
  gap: `${designTokens.space[1]}px`,
} as const
