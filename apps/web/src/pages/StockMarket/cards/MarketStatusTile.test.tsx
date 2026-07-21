import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { stockMarketFeed } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { MarketStatusTile } from './MarketStatusTile'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('MarketStatusTile', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1_783_450_800_000)
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders placeholders when feed is unavailable', () => {
    render(<MarketStatusTile />)

    expect(screen.getByText('Sesja rynku')).toBeInTheDocument()
    expect(screen.getAllByText('--')).toHaveLength(2)
  })

  it('renders market session countdown when feed data is available', () => {
    mockedUseFeed.mockReturnValue(stockMarketFeed())

    render(<MarketStatusTile />)

    expect(screen.getByText('Sesja rynku')).toBeInTheDocument()
    expect(screen.getByText('Zamknięcie za 1g')).toBeInTheDocument()
    expect(screen.getByText('Otwarta')).toBeInTheDocument()
  })
})
