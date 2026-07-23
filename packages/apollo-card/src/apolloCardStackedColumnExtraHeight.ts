import { cardGridGap } from '@repo/design-tokens'
import { apolloCardHeaderHeight } from './cardHeaderLayout'
import {
  CARD_BORDER_WIDTH,
  CARD_CONTENT_HEIGHT_BUFFER,
  CARD_CONTENT_PADDING_BOTTOM,
  CARD_CONTENT_PADDING_TOP,
} from './styled'

export type ApolloCardStackedColumnExtraHeightParams = {
  /** Content row count of the card spanning the stacked column. */
  spanningRows: number
  /** Content row counts of cards stacked in the adjacent column, top to bottom. */
  stackedRows: readonly number[]
  /** CSS grid row gap between stacked cards, in pixels. */
  gridRowGap: number
}

/**
 * Extra content height for a spanning card whose total height should match a
 * stacked column. Each additional stacked card adds one grid gap, one header,
 * and the card's top + bottom border.
 */
export const apolloCardStackedColumnExtraHeight = (stackedCardCount: number): number => {
  return stackedCardCount > 1
    ? (stackedCardCount - 1) *
        (cardGridGap +
          apolloCardHeaderHeight +
          2 * CARD_BORDER_WIDTH +
          CARD_CONTENT_PADDING_TOP +
          CARD_CONTENT_PADDING_BOTTOM +
          CARD_CONTENT_HEIGHT_BUFFER)
    : 0
}
