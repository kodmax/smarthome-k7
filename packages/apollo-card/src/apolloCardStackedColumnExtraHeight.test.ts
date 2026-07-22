import { designTokens } from '@repo/design-tokens'
import { describe, expect, it } from 'vitest'
import { apolloCardHeaderMinHeight } from './cardHeaderLayout'
import { apolloCardStackedColumnExtraHeight } from './apolloCardStackedColumnExtraHeight'
import { apolloCardContentHeightPx } from './styled'

const cardBorderWidthPx = designTokens.borderWidth.hairline

describe('apolloCardStackedColumnExtraHeight', () => {
  it('adds one gap and one header for two stacked cards beside a spanning card', () => {
    const spanningRows = 24
    const stackedRows = [13, 8] as const
    const gridRowGap = 12

    const expected =
      gridRowGap +
      apolloCardHeaderMinHeight +
      2 * cardBorderWidthPx +
      apolloCardContentHeightPx(stackedRows[0]) +
      apolloCardContentHeightPx(stackedRows[1]) -
      apolloCardContentHeightPx(spanningRows)

    expect(
      apolloCardStackedColumnExtraHeight({
        spanningRows,
        stackedRows,
        gridRowGap,
      }),
    ).toBe(expected)
  })

  it('returns zero when a single stacked card matches the spanning card content height', () => {
    const rows = 6

    expect(
      apolloCardStackedColumnExtraHeight({
        spanningRows: rows,
        stackedRows: [rows],
        gridRowGap: 12,
      }),
    ).toBe(0)
  })
})
