import { designTokens } from '@repo/design-tokens'

const { font, components } = designTokens

type FontVariant = 'caption' | 'h1' | 'h3' | 'display2' | 'metricLg' | 'status'

export const fontSx = (variant: FontVariant) => ({
  fontSize: font[variant].size,
  fontWeight: font[variant].weight,
  lineHeight: font[variant].lineHeight,
})

export const sectionLabelSx = {
  color: 'text.secondary',
  fontWeight: components.sectionLabel.fontWeight,
  letterSpacing: components.sectionLabel.letterSpacing,
  textTransform: 'uppercase',
  fontSize: font.caption.size,
  mb: 1,
} as const

export const borderedPanelSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: `${components.panel.borderRadius}px`,
  bgcolor: 'background.paper',
  p: `${components.panel.padding}px`,
  height: '100%',
} as const

export const metricValueSx = fontSx('h3')
export const metricLgSx = { ...fontSx('metricLg'), color: 'energy.main' }
export const statusSx = { ...fontSx('status'), color: 'energy.main' }
export const timerValueSx = {
  ...fontSx('display2'),
  letterSpacing: components.progressRing.timerLetterSpacing,
}
