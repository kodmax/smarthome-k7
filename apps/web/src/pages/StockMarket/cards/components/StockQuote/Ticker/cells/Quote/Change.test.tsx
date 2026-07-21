import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { renderInTableRow } from '@/pages/Dashboard/test/renderInTable'
import { Change } from './Change'

describe('Change', () => {
  it('renders positive change with a plus sign', () => {
    renderInTableRow(
      <Change
        ticker={ticker({
          symbol: 'AAA',
          price: { lastTradePrice: 123.456, netChange: 1.2, percentageChange: 2.5 },
        })}
      />,
    )

    expect(screen.getByText('+2.50%')).toBeInTheDocument()
  })

  it('renders negative change without a plus sign', () => {
    renderInTableRow(
      <Change
        ticker={ticker({
          symbol: 'BBB',
          price: { lastTradePrice: 50, netChange: -0.5, percentageChange: -1.25 },
        })}
      />,
    )

    expect(screen.getByText('-1.25%')).toBeInTheDocument()
    expect(screen.queryByText('+')).not.toBeInTheDocument()
  })
})
