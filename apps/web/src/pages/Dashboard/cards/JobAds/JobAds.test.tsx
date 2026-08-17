import { renderWithTheme as render, screen } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { setStoredDashboardJobAdsSalary } from '@/app/preferences'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { jobAdsFeed } from '@/pages/JobMarket/test/fixtures/jobAdsFeed'
import { JobAds } from './JobAds'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

const paidRoleAd = jobAd({
  id: '1',
  title: 'Paid Role',
  employmentType: 'b2b',
  workplaceType: 'hybrid',
  meta: { application: { status: 'pending-review' } },
  monthlySalaryRangeAfterTaxes: { from: 20_000, to: 28_000 },
})

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

  it('shows salary column for dashboard job ads by default', () => {
    mockedUseFeed.mockReturnValue(jobAdsFeed(paidRoleAd))

    render(<JobAds />)

    expect(screen.getByText('Paid Role')).toBeInTheDocument()
    expect(screen.getAllByLabelText('B2B').length).toBeGreaterThan(0)
    expect(screen.getByText('28.0')).toBeInTheDocument()
    expect(screen.getByText('kPLN')).toBeInTheDocument()
  })

  it('hides salary column when dashboard preference is disabled', () => {
    setStoredDashboardJobAdsSalary(false)
    mockedUseFeed.mockReturnValue(jobAdsFeed(paidRoleAd))

    render(<JobAds />)

    expect(screen.getByText('Paid Role')).toBeInTheDocument()
    expect(screen.queryByLabelText('B2B')).not.toBeInTheDocument()
    expect(screen.queryByText('28.0')).not.toBeInTheDocument()
    expect(screen.queryByText('kPLN')).not.toBeInTheDocument()
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
