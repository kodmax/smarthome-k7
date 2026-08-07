import { renderWithTheme as render, screen } from '@/test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { useFeed } from '@repo/feed-client'
import { JobAdsFeed } from '@repo/types'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { jobAdsFeed } from '@/pages/JobMarket/test/fixtures/jobAdsFeed'
import { JobAds } from './JobAds'

vi.mock('@mui/material', async importOriginal => {
  const actual = await importOriginal<typeof import('@mui/material')>()
  return {
    ...actual,
    useMediaQuery: () => true,
  }
})

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
  useCommand: vi.fn(() => vi.fn()),
}))

const mockedUseFeed = vi.mocked(useFeed)

function mockJobAdsFeeds(jobAds: JobAdsFeed, insight?: { popularTechnologies: { id: string; name: string }[] }) {
  mockedUseFeed.mockImplementation(topic => {
    if (topic === 'job-ads') {
      return jobAds
    }
    if (topic === 'job-market-insight') {
      return {
        popularTechnologies: insight?.popularTechnologies ?? [],
      }
    }
    return undefined
  })
}

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
    mockJobAdsFeeds(
      jobAdsFeed(jobAd({ id: '1', title: 'Backend Engineer' }), jobAd({ id: '2', title: 'Frontend Engineer' })),
    )

    render(<JobAds />)

    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  })

  it('shows only pending-review ads with the default filter', () => {
    mockJobAdsFeeds(
      jobAdsFeed(
        jobAd({ id: '1', title: 'Open Role', meta: { application: { status: 'pending-review' } } }),
        jobAd({ id: '2', title: 'Applied Role', meta: { application: { status: 'applied' } } }),
      ),
    )

    render(<JobAds />)

    expect(screen.getByText('Open Role')).toBeInTheDocument()
    expect(screen.queryByText('Applied Role')).not.toBeInTheDocument()
  })

  it('opens manual job ad dialog from card action', () => {
    mockJobAdsFeeds(jobAdsFeed(jobAd({ id: '1', title: 'Open Role' })))

    render(<JobAds />)

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj ogłoszenie' }))

    expect(screen.getByRole('heading', { name: 'Dodaj ogłoszenie ręcznie' })).toBeInTheDocument()
  })

  it('shows salary slider only on pending-review view', () => {
    mockJobAdsFeeds({
      ...jobAdsFeed(jobAd({ id: '1', title: 'Open Role', meta: { application: { status: 'pending-review' } } })),
      salaryRange: { min: 15_000, max: 35_000 },
      acceptableSalary: 24_000,
    })

    render(<JobAds />)

    expect(screen.getByRole('slider', { name: 'Minimalne akceptowalne wynagrodzenie' })).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Filtr' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zaaplikowane' }))

    expect(screen.queryByRole('slider', { name: 'Minimalne akceptowalne wynagrodzenie' })).not.toBeInTheDocument()
  })

  it('filters ads by required skills with AND semantics', () => {
    mockJobAdsFeeds(
      jobAdsFeed(
        jobAd({
          id: '1',
          title: 'Full stack',
          requiredSkills: ['TypeScript', 'React'],
          meta: { application: { status: 'pending-review' } },
        }),
        jobAd({
          id: '2',
          title: 'Backend only',
          requiredSkills: ['TypeScript'],
          meta: { application: { status: 'pending-review' } },
        }),
      ),
    )

    render(<JobAds />)

    expect(screen.getByText('Full stack')).toBeInTheDocument()
    expect(screen.getByText('Backend only')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Umiejętności' }))
    fireEvent.click(screen.getByRole('option', { name: 'TypeScript' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Umiejętności' }))
    fireEvent.click(screen.getByRole('option', { name: 'React' }))

    expect(screen.getByText('Full stack')).toBeInTheDocument()
    expect(screen.queryByText('Backend only')).not.toBeInTheDocument()
  })

  it('keeps selected skills when switching status views', () => {
    mockJobAdsFeeds(
      jobAdsFeed(
        jobAd({
          id: '1',
          title: 'Open React Role',
          requiredSkills: ['React'],
          meta: { application: { status: 'pending-review' } },
        }),
        jobAd({
          id: '2',
          title: 'Applied React Role',
          requiredSkills: ['React'],
          meta: { application: { status: 'applied' } },
        }),
        jobAd({
          id: '3',
          title: 'Applied Plain Role',
          requiredSkills: [],
          meta: { application: { status: 'applied' } },
        }),
      ),
    )

    render(<JobAds />)

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Umiejętności' }))
    fireEvent.click(screen.getByRole('option', { name: 'React' }))

    expect(screen.queryByText('Applied React Role')).not.toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Filtr' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zaaplikowane' }))

    expect(screen.getByText('Applied React Role')).toBeInTheDocument()
    expect(screen.queryByText('Applied Plain Role')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
  })
})
