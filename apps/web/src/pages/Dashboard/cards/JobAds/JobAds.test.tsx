import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { jobAdsFeed } from '@/pages/JobMarket/test/fixtures/jobAdsFeed'
import { JobAds } from './JobAds'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('JobAds', () => {
  beforeEach(() => {
    mockedUseFeed.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<JobAds />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders dashboard-visible job ads from the feed', () => {
    mockedUseFeed.mockReturnValue(
      jobAdsFeed(
        jobAd({ id: '1', title: 'Open Role', meta: { application: { status: 'pending-review' } } }),
        jobAd({ id: '2', title: 'Applied Role', meta: { application: { status: 'applied' } } }),
        jobAd({
          id: '3',
          title: 'Archived Role',
          meta: { application: { status: 'archived', archiveReason: 'rejected' } },
        }),
      ),
    )

    render(<JobAds />)

    expect(screen.getByText('Open Role')).toBeInTheDocument()
    expect(screen.getByText('Applied Role')).toBeInTheDocument()
    expect(screen.queryByText('Archived Role')).not.toBeInTheDocument()
  })

  it('shows abbreviated applied days for applied job ads', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    mockedUseFeed.mockReturnValue(
      jobAdsFeed(
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

    render(<JobAds />)

    expect(screen.getByText('Applied Role')).toBeInTheDocument()
    expect(screen.getByText('6d')).toBeInTheDocument()
  })
})
