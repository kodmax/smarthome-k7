import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ticker } from '@/test/fixtures/stockMarket'
import { renderInTableRow } from '@/test/renderInTable'
import { PEAtPT } from './PEAtPT'

describe('PEAtPT', () => {
  it('renders formatted trailing and forward PE values', () => {
    renderInTableRow(
      <PEAtPT
        ticker={ticker({
          symbol: 'AAA',
          price: { lastTradePrice: 100, priceTarget: 120 },
          statistics: { trailingEPS: 5, forwardEPS: 6 },
        })}
      />,
    )

    expect(screen.getByRole('cell')).toHaveTextContent('24 → 20')
  })

  it('renders placeholders when values are unavailable', () => {
    renderInTableRow(
      <PEAtPT
        ticker={ticker({
          symbol: 'BBB',
          price: { priceTarget: null },
          statistics: { trailingEPS: 0, forwardEPS: null },
        })}
      />,
    )

    expect(screen.getByRole('cell')).toHaveTextContent('-- → --')
  })
})
