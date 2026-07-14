import { designTokens } from '@repo/design-tokens'

const { font, icon, space } = designTokens

const HEADER_PADDING_TOP = 12
const HEADER_PADDING_BOTTOM = space[2]

export const CARD_HINT_ICON_SCALE = 1.25

export const apolloCardHintIconSize = Math.round(icon.sizeSm * CARD_HINT_ICON_SCALE)

export const apolloCardHintIconStrokeWidth = icon.strokeWidth

const scaledHeaderContentHeight = Math.round(font.h3.size * CARD_HINT_ICON_SCALE * font.h3.lineHeight)

export const apolloCardHeaderMinHeight =
  HEADER_PADDING_TOP + Math.max(scaledHeaderContentHeight, apolloCardHintIconSize) + HEADER_PADDING_BOTTOM
