import { renderWithTheme as render, screen } from '@/test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobs'
import { jobsFeed } from '@/pages/JobMarket/test/fixtures/jobsFeed'
import { Jobs } from './Jobs'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
  useCommand: vi.fn(() => vi.fn()),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('Jobs', () => {
  beforeEach(() => {
    mockedUseFeed.mockReturnValue(undefined)
  })

  it('renders a loading placeholder when feed is unavailable', () => {
    const { container } = render(<Jobs />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(12)
  })

  it('renders job ads from the feed', () => {
    mockedUseFeed.mockReturnValue(
      jobsFeed(jobAd({ id: '1', title: 'Backend Engineer' }), jobAd({ id: '2', title: 'Frontend Engineer' })),
    )

    render(<Jobs />)

    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  })

  it('shows only not-applied ads with the default latest filter', () => {
    mockedUseFeed.mockReturnValue(
      jobsFeed(
        jobAd({ id: '1', title: 'Open Role', meta: { application: { status: 'not-applied' } } }),
        jobAd({ id: '2', title: 'Applied Role', meta: { application: { status: 'applied' } } }),
      ),
    )

    render(<Jobs />)

    expect(screen.getByText('Open Role')).toBeInTheDocument()
    expect(screen.queryByText('Applied Role')).not.toBeInTheDocument()
  })
})
