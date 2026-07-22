import { designTokens } from '@repo/design-tokens'
import { apolloCardHeaderMinHeight } from './cardHeaderLayout'
import { apolloCardContentHeightPx } from './styled'

const cardBorderWidthPx = designTokens.borderWidth.hairline

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
export const apolloCardStackedColumnExtraHeight = ({
  spanningRows,
  stackedRows,
  gridRowGap,
}: ApolloCardStackedColumnExtraHeightParams): number => {
  const stackedCardCount = stackedRows.length
  const gapTotal = (stackedCardCount - 1) * gridRowGap
  const headerTotal = (stackedCardCount - 1) * apolloCardHeaderMinHeight
  const borderTotal = (stackedCardCount - 1) * 2 * cardBorderWidthPx
  const stackedContentTotal = stackedRows.reduce((sum, rows) => sum + apolloCardContentHeightPx(rows), 0)

  return gapTotal + headerTotal + borderTotal + stackedContentTotal - apolloCardContentHeightPx(spanningRows)
}
