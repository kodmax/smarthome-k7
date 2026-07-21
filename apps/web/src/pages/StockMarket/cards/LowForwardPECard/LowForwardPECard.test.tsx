import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { LowForwardPECard } from './LowForwardPECard'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('LowForwardPECard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1_783_450_800_000)
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<LowForwardPECard />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders tickers sorted by forward PE when feed data is available', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'NVDA', price: { lastTradePrice: 120, priceTarget: 150 }, statistics: { forwardEPS: 6 } }),
        ticker({ symbol: 'MU', price: { lastTradePrice: 60, priceTarget: 110 }, statistics: { forwardEPS: 6 } }),
      ),
    )

    render(<LowForwardPECard />)

    expect(screen.getByText('Niskie prognozowane C/Z na celu')).toBeInTheDocument()
    expect(screen.getByText('Symbol')).toBeInTheDocument()

    const rows = screen.getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('MU')
    expect(rows[1]).toHaveTextContent('NVDA')
  })
})
