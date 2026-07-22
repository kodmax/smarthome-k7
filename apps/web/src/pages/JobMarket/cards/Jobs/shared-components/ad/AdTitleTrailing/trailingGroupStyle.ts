import { designTokens } from '@repo/design-tokens'

export const trailingGroupStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  flexShrink: 0,
  gap: `${designTokens.space[1]}px`,
} as const
