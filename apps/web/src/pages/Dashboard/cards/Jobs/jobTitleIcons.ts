import { designTokens } from '@repo/design-tokens'

export const jobTitleIconSize = designTokens.icon.sizeXs - 4

export const jobTitleLeadingGroupStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  marginRight: `${designTokens.space[1]}px`,
  gap: `${designTokens.space[1]}px`,
} as const
