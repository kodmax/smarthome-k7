import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { HighUpsideCard } from './HighUpsideCard'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('HighUpsideCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1_783_450_800_000)
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<HighUpsideCard />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders sorted ticker rows when feed data is available', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'MU', exchange: 'NYSE', price: { eg: 45, lastTradePrice: 95.5, priceTarget: 110 } }),
        ticker({ symbol: 'NVDA', price: { eg: 50, lastTradePrice: 120, priceTarget: 150 } }),
      ),
    )

    render(<HighUpsideCard />)

    expect(screen.getByText('Duży upside')).toBeInTheDocument()
    expect(screen.getByText('Symbol')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('110.00')).toBeInTheDocument()
    expect(screen.getByText('150.00')).toBeInTheDocument()
    expect(screen.getByText('120.00')).toBeInTheDocument()
    expect(screen.getByText('95.50')).toBeInTheDocument()
  })
})
