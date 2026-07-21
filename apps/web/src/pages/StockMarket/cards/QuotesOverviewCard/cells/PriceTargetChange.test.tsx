import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { renderInTableRow } from '@/pages/Dashboard/test/renderInTable'
import { PriceTargetChange } from './PriceTargetChange'

describe('PriceTargetChange', () => {
  it('renders positive change with a plus sign', () => {
    renderInTableRow(
      <PriceTargetChange
        ticker={ticker({
          symbol: 'AAA',
          quoteSummary: { priceTargetChange: { last30days: 0.0525 } },
        })}
      />,
    )

    expect(screen.getByText('+5.25%')).toBeInTheDocument()
  })

  it('renders negative change without a plus sign', () => {
    renderInTableRow(
      <PriceTargetChange
        ticker={ticker({
          symbol: 'BBB',
          quoteSummary: { priceTargetChange: { last30days: -0.031 } },
        })}
      />,
    )

    expect(screen.getByText('-3.10%')).toBeInTheDocument()
  })

  it('renders placeholder when change is unavailable', () => {
    renderInTableRow(
      <PriceTargetChange
        ticker={ticker({
          symbol: 'CCC',
          quoteSummary: { priceTargetChange: { last30days: null } },
        })}
      />,
    )

    expect(screen.getByText('--')).toBeInTheDocument()
  })
})
