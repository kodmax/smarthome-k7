import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCommand } from '@repo/feed-client'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderWithTheme } from '@/test/test-utils'
import { JobAdsEditView } from './JobAdsEditView'

vi.mock('@repo/feed-client', () => ({
  useCommand: vi.fn(() => vi.fn()),
}))

describe('JobAdsEditView archived filter', () => {
  it('renders archived ads grouped by archive reason', () => {
    renderWithTheme(
      <JobAdsEditView
        zoom={true}
        filter='archived'
        ads={[
          jobAd({
            id: '1',
            title: 'Rejected Role',
            meta: { application: { status: 'archived', archiveReason: 'rejected' } },
          }),
          jobAd({
            id: '2',
            title: 'Not Interested Role',
            meta: { application: { status: 'archived', archiveReason: 'other' } },
          }),
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: /Inny/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Odrzucone/i })).toBeInTheDocument()
    expect(screen.getByText('Rejected Role')).toBeInTheDocument()
    expect(screen.getByText('Not Interested Role')).toBeInTheDocument()
    expect(vi.mocked(useCommand)).toHaveBeenCalled()
  })

  it('filters ads by required skills within the active status view', () => {
    renderWithTheme(
      <JobAdsEditView
        zoom={true}
        filter='pending-review'
        skillsFilter={['TypeScript', 'PostgreSQL']}
        ads={[
          jobAd({
            id: '1',
            title: 'Matching Role',
            requiredSkills: ['TypeScript', 'PostgreSQL'],
            meta: { application: { status: 'pending-review' } },
          }),
          jobAd({
            id: '2',
            title: 'Partial Role',
            requiredSkills: ['TypeScript'],
            meta: { application: { status: 'pending-review' } },
          }),
        ]}
      />,
    )

    expect(screen.getByText('Matching Role')).toBeInTheDocument()
    expect(screen.queryByText('Partial Role')).not.toBeInTheDocument()
  })

  it('filters archived ads by appliedAt when onlyAppliedArchived is enabled', () => {
    renderWithTheme(
      <JobAdsEditView
        zoom={true}
        filter='archived'
        onlyAppliedArchived={true}
        ads={[
          jobAd({
            id: '1',
            title: 'Applied archived',
            meta: {
              application: {
                status: 'archived',
                archiveReason: 'rejected',
                appliedAt: '2026-01-01T00:00:00.000Z',
              },
            },
          }),
          jobAd({
            id: '2',
            title: 'Skipped archived',
            meta: { application: { status: 'archived', archiveReason: 'other', appliedAt: null } },
          }),
        ]}
      />,
    )

    expect(screen.getByText('Applied archived')).toBeInTheDocument()
    expect(screen.queryByText('Skipped archived')).not.toBeInTheDocument()
  })
})
