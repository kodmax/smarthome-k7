import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { TomorrowEarningsTile } from './TomorrowEarningsTile'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('TomorrowEarningsTile', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T12:00:00'))
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders placeholders when feed is unavailable', () => {
    render(<TomorrowEarningsTile />)

    expect(screen.getByText('Raport kwartalny jutro')).toBeInTheDocument()
    expect(screen.getAllByText('--')).toHaveLength(2)
  })

  it('renders count and tickers for companies reporting tomorrow', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(
        ticker({ symbol: 'MU', earningsDate: { confirmed: '2026-06-29' } }),
        ticker({ symbol: 'NVDA', earningsDate: { confirmed: '2026-06-29' } }),
        ticker({ symbol: 'LATER', earningsDate: { confirmed: '2026-07-15' } }),
      ),
    )

    render(<TomorrowEarningsTile />)

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('MU, NVDA')).toBeInTheDocument()
  })

  it('renders zero count when no companies report tomorrow', () => {
    mockedUseFeed.mockReturnValue(
      stockMarketFeed(ticker({ symbol: 'LATER', earningsDate: { confirmed: '2026-07-15' } })),
    )

    render(<TomorrowEarningsTile />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('--')).toBeInTheDocument()
  })
})
