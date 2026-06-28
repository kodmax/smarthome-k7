import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed, ticker } from '@/test/fixtures/stockMarket'
import { StockMarket } from './StockMarket'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('StockMarket', () => {
  beforeEach(() => {
    mockedUseFeed.mockReturnValue(undefined)
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<StockMarket />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders ticker rows when feed data is available', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'MU', price: { eg: 15, lastTradePrice: 95.5 } }),
        ticker({ symbol: 'NVDA', price: { eg: 25, lastTradePrice: 120 } }),
      ),
    )

    render(<StockMarket />)

    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('120.00')).toBeInTheDocument()
    expect(screen.getByText('95.50')).toBeInTheDocument()
  })
})
