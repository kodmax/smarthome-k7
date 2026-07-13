import { designTokens } from '@repo/design-tokens'
import { describe, expect, it } from 'vitest'
import { apolloCardContentHeight, apolloCardRowHeight } from './styled'

const { font, space } = designTokens

describe('apolloCardContentHeight', () => {
  it('matches body line height and vertical content padding tokens', () => {
    expect(apolloCardRowHeight).toBe(font.body.size * font.body.lineHeight)

    const rows = 4
    const expected = Math.round(rows * apolloCardRowHeight + space[3] * 2)

    expect(apolloCardContentHeight(rows)).toBe(`${expected}px`)
  })
})
