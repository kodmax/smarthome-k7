import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobs'
import { jobsFeed } from '@/pages/JobMarket/test/fixtures/jobsFeed'
import { Jobs } from './Jobs'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('Jobs', () => {
  beforeEach(() => {
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<Jobs />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders dashboard-visible job ads from the feed', () => {
    mockedUseFeed.mockReturnValue(
      jobsFeed(
        jobAd({ id: '1', title: 'Open Role', meta: { application: { status: 'not-applied' } } }),
        jobAd({ id: '2', title: 'Applied Role', meta: { application: { status: 'applied' } } }),
        jobAd({ id: '3', title: 'Rejected Role', meta: { application: { status: 'rejected' } } }),
      ),
    )

    render(<Jobs />)

    expect(screen.getByText('Open Role')).toBeInTheDocument()
    expect(screen.getByText('Applied Role')).toBeInTheDocument()
    expect(screen.queryByText('Rejected Role')).not.toBeInTheDocument()
  })

  it('shows abbreviated applied days for applied job ads', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    mockedUseFeed.mockReturnValue(
      jobsFeed(
        jobAd({
          id: '2',
          title: 'Applied Role',
          meta: {
            application: {
              status: 'applied',
              appliedAt: '2026-07-13T08:00:00.000Z',
            },
          },
        }),
      ),
    )

    render(<Jobs />)

    expect(screen.getByText('Applied Role')).toBeInTheDocument()
    expect(screen.getByText('6d')).toBeInTheDocument()
  })
})
