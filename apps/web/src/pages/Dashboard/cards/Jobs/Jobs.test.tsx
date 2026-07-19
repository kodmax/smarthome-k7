import { renderWithTheme as render, screen } from '@/test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/pages/Dashboard/test/fixtures/jobs'
import { jobsFeed } from '@/pages/Dashboard/test/fixtures/jobsFeed'
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

  it('hides terminal-status ads in normal view', () => {
    mockedUseFeed.mockReturnValue(
      jobsFeed(
        jobAd({ id: '1', title: 'Active Role', meta: { application: { status: 'applied' } } }),
        jobAd({ id: '2', title: 'Rejected Role', meta: { application: { status: 'rejected' } } }),
      ),
    )

    render(<Jobs />)

    expect(screen.getByText('Active Role')).toBeInTheDocument()
    expect(screen.queryByText('Rejected Role')).not.toBeInTheDocument()
  })
})
