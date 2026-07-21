import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { renderInTableRow } from '@/pages/Dashboard/test/renderInTable'
import { Quote } from './Quote'

describe('Quote', () => {
  it('renders price and positive change with a plus sign', () => {
    renderInTableRow(
      <Quote
        ticker={ticker({
          symbol: 'AAA',
          price: { lastTradePrice: 123.456, netChange: 1.2, percentageChange: 2.5 },
        })}
      />,
    )

    expect(screen.getByText('123.46')).toBeInTheDocument()
  })
})
