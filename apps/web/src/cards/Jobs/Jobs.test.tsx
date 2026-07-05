import { renderWithTheme as render, screen } from '@/test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/test/fixtures/jobs'
import { jobsFeed } from '@/test/fixtures/jobsFeed'
import { Jobs } from './Jobs'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
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
})
