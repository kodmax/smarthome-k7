import { designTokens } from '@repo/design-tokens'
import { describe, expect, it } from 'vitest'
import { apolloCardHeaderHeight } from './cardHeaderLayout'
import { apolloCardStackedColumnExtraHeight } from './apolloCardStackedColumnExtraHeight'
import { apolloCardContentHeightPx } from './styled'

const cardBorderWidthPx = designTokens.borderWidth.hairline

describe('apolloCardStackedColumnExtraHeight', () => {
  it('adds one gap and one header for two stacked cards beside a spanning card', () => {
    const spanningRows = 24
    const stackedRows = [12, 12] as const
    const gridRowGap = designTokens.layout.cardGridGap

    const expected =
      gridRowGap +
      apolloCardHeaderHeight +
      2 * cardBorderWidthPx +
      apolloCardContentHeightPx(stackedRows[0]) +
      apolloCardContentHeightPx(stackedRows[1]) -
      apolloCardContentHeightPx(spanningRows)

    expect(apolloCardStackedColumnExtraHeight(2)).toBe(expected)
  })

  it('returns zero when a single stacked card matches the spanning card content height', () => {
    expect(apolloCardStackedColumnExtraHeight(0)).toBe(0)
  })

  it('returns zero when extraHeight is ommited', () => {
    expect(apolloCardStackedColumnExtraHeight(0)).toBe(0)
  })
})
