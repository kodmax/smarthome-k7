import { indicatorRed } from '../cards/components/colorForValueInRange'

export type CardHintIconVariant = 'info' | 'warning'

export const cardHintIconColor = (variant: CardHintIconVariant): string =>
  variant === 'info' ? 'var(--mui-palette-info-main)' : indicatorRed
