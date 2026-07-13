import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardHeadingHints } from './CardHeadingHints'

describe('CardHeadingHints', () => {
  it('renders nothing when all children are empty', () => {
    const { container } = render(
      <CardHeadingHints>
        {null}
        {false}
      </CardHeadingHints>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders children in a row', () => {
    render(
      <CardHeadingHints>
        <span>one</span>
        <span>two</span>
      </CardHeadingHints>,
    )

    expect(screen.getByText('one')).toBeInTheDocument()
    expect(screen.getByText('two')).toBeInTheDocument()
  })
})
