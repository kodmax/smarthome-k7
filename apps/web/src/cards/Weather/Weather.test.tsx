import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { weatherFeed } from '@/test/fixtures/weather'
import { Weather } from './Weather'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('Weather', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T12:00:00'))
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<Weather />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(4)
  })

  it('renders current weather values from the feed', () => {
    mockedUseFeed.mockReturnValue(weatherFeed())

    render(<Weather />)

    expect(screen.getByText('Temperatura').closest('tr')).toHaveTextContent(/22\s*°C/)
    expect(screen.getByText('Wilgotność').closest('tr')).toHaveTextContent(/55\s*%/)
    expect(screen.getByText('Predkość wiatru').closest('tr')).toHaveTextContent(/5\s*m\/s/)
  })
})
