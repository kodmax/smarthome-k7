import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderWithTheme } from '@/test/test-utils'
import { JobAdsArchivedAdList } from './JobAdsArchivedAdList'

const noop = () => undefined

describe('JobAdsArchivedAdList', () => {
  it('renders grouped sections with labels and counts', () => {
    renderWithTheme(
      <JobAdsArchivedAdList
        groups={[
          {
            archiveReason: 'not-interested',
            ads: [jobAd({ id: '1', title: 'Skipped Role' })],
          },
          {
            archiveReason: 'rejected',
            ads: [jobAd({ id: '2', title: 'Rejected Role A' }), jobAd({ id: '3', title: 'Rejected Role B' })],
          },
        ]}
        zoom={true}
        onFav={noop}
        onUnfav={noop}
        onAnalyzeCvMatch={noop}
      />,
    )

    expect(screen.getByRole('button', { name: /Nie interesuje mnie/i })).toHaveTextContent('(1)')
    expect(screen.getByRole('button', { name: /Odrzucone/i })).toHaveTextContent('(2)')
    expect(screen.getByText('Skipped Role')).toBeInTheDocument()
    expect(screen.getByText('Rejected Role A')).toBeInTheDocument()
    expect(screen.getByText('Rejected Role B')).toBeInTheDocument()
  })

  it('collapses a section when its summary is clicked', () => {
    renderWithTheme(
      <JobAdsArchivedAdList
        groups={[
          {
            archiveReason: 'withdrawn',
            ads: [jobAd({ id: '4', title: 'Withdrawn Role' })],
          },
        ]}
        zoom={true}
        onFav={noop}
        onUnfav={noop}
        onAnalyzeCvMatch={noop}
      />,
    )

    const summary = screen.getByRole('button', { name: /Rozmyśliłem się/i })

    expect(summary).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Withdrawn Role')).toBeInTheDocument()

    fireEvent.click(summary)

    expect(summary).toHaveAttribute('aria-expanded', 'false')
  })
})
