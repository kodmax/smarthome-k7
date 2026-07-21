import { renderWithTheme as render, screen } from '@/test/test-utils'
import { describe, expect, it } from 'vitest'
import { PowerIcon } from '@repo/assets'
import { ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { StockQuotes } from './StockQuotes'
import { EG } from '../../FilteredStockQuotesCard/cells/EG'

describe('StockQuotes', () => {
  it('renders a loading placeholder when tickers are unavailable', () => {
    const { container } = render(
      <StockQuotes
        tickers={undefined}
        title='Notowania'
        icon={PowerIcon}
        customColumnTitle='Do celu'
        CustomColumnContent={EG}
      />,
    )

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders ticker rows when tickers are provided', () => {
    render(
      <StockQuotes
        title='Notowania'
        icon={PowerIcon}
        customColumnTitle='Do celu'
        CustomColumnContent={EG}
        tickers={[
          ticker({ symbol: 'MU', exchange: 'NYSE', price: { eg: 15, lastTradePrice: 95.5, priceTarget: 110 } }),
          ticker({ symbol: 'NVDA', price: { eg: 25, lastTradePrice: 120, priceTarget: 150 } }),
        ]}
      />,
    )

    expect(screen.getByText('Notowania')).toBeInTheDocument()
    expect(screen.getByText('Symbol')).toBeInTheDocument()
    expect(screen.getByText('Do celu')).toBeInTheDocument()
    expect(screen.getByText('Notowanie')).toBeInTheDocument()
    expect(screen.getByText('Zmiana')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('120.00')).toBeInTheDocument()
    expect(screen.getByText('95.50')).toBeInTheDocument()
    expect(screen.getAllByText('+1.00%')).toHaveLength(2)
  })
})
