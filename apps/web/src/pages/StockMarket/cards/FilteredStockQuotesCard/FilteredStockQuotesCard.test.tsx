import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { FilteredStockQuotesCard } from './FilteredStockQuotesCard'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('FilteredStockQuotesCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1_783_450_800_000)
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<FilteredStockQuotesCard />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders high upside tickers by default when feed data is available', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'MU', exchange: 'NYSE', price: { eg: 45, lastTradePrice: 95.5, priceTarget: 110 } }),
        ticker({ symbol: 'NVDA', price: { eg: 50, lastTradePrice: 120, priceTarget: 150 } }),
      ),
    )

    render(<FilteredStockQuotesCard />)

    expect(screen.getByText('Przegląd')).toBeInTheDocument()
    expect(screen.getByText('Duży upside')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('renders filter select in heading with default high upside option', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'NVDA', price: { lastTradePrice: 120, priceTarget: 150 }, statistics: { forwardEPS: 6 } }),
        ticker({ symbol: 'MU', price: { lastTradePrice: 60, priceTarget: 110 }, statistics: { forwardEPS: 6 } }),
      ),
    )

    render(<FilteredStockQuotesCard />)

    expect(screen.getByLabelText('Filtr')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveTextContent('Duży upside')
  })
})
