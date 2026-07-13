import { designTokens } from '@repo/design-tokens'
import { describe, expect, it } from 'vitest'
import { apolloCardContentHeight, apolloCardContentRowHeight, apolloCardRowHeight } from './styled'

const { font, space } = designTokens

describe('apolloCardContentHeight', () => {
  it('uses content row height, vertical padding, and a one pixel buffer', () => {
    expect(apolloCardRowHeight).toBe(Math.ceil(font.body.size * font.body.lineHeight))
    expect(apolloCardContentRowHeight).toBe(apolloCardRowHeight + 1)

    const rows = 4
    const expected = rows * apolloCardContentRowHeight + space[3] * 2 + 1

    expect(apolloCardContentHeight(rows)).toBe(`${expected}px`)
  })
})
