import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { StockMarket } from './StockMarket'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('StockMarket', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1_783_450_800_000)
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<StockMarket />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders ticker rows when feed data is available', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'MU', exchange: 'NYSE', price: { eg: 15, lastTradePrice: 95.5 } }),
        ticker({ symbol: 'NVDA', price: { eg: 25, lastTradePrice: 120 } }),
      ),
    )

    render(<StockMarket />)

    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('120.00')).toBeInTheDocument()
    expect(screen.getByText('95.50')).toBeInTheDocument()
    expect(screen.getByText('Zamknięcie za 1g')).toBeInTheDocument()
    expect(screen.getByTitle('Otwarta')).toBeInTheDocument()
  })
})
