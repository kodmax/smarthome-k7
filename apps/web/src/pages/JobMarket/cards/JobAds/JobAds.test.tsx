import { renderWithTheme as render, screen } from '@/test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { jobAdsFeed } from '@/pages/JobMarket/test/fixtures/jobAdsFeed'
import { JobAds } from './JobAds'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
  useCommand: vi.fn(() => vi.fn()),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('JobAds', () => {
  beforeEach(() => {
    mockedUseFeed.mockReturnValue(undefined)
  })

  it('renders an empty card when feed is unavailable', () => {
    render(<JobAds />)

    expect(screen.getByRole('heading', { name: 'Oferty pracy' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('renders job ads from the feed', () => {
    mockedUseFeed.mockReturnValue(
      jobAdsFeed(jobAd({ id: '1', title: 'Backend Engineer' }), jobAd({ id: '2', title: 'Frontend Engineer' })),
    )

    render(<JobAds />)

    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  })

  it('shows only pending-review ads with the default filter', () => {
    mockedUseFeed.mockReturnValue(
      jobAdsFeed(
        jobAd({ id: '1', title: 'Open Role', meta: { application: { status: 'pending-review' } } }),
        jobAd({ id: '2', title: 'Applied Role', meta: { application: { status: 'applied' } } }),
      ),
    )

    render(<JobAds />)

    expect(screen.getByText('Open Role')).toBeInTheDocument()
    expect(screen.queryByText('Applied Role')).not.toBeInTheDocument()
  })
})
