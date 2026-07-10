import { designTokens } from '@repo/design-tokens'

export const sectionLabelSx = {
  color: 'text.secondary',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontSize: designTokens.font.caption.size,
  mb: 1,
} as const

export const borderedPanelSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: `${designTokens.radius.lg}px`,
  bgcolor: 'background.paper',
  p: 3,
  height: '100%',
} as const
