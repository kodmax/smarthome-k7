import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
            archiveReason: 'other',
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

    expect(screen.getByRole('button', { name: /Inny/i })).toHaveTextContent('(1)')
    expect(screen.getByRole('button', { name: /Odrzucone/i })).toHaveTextContent('(2)')
    expect(screen.getByRole('button', { name: /Inny/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /Odrzucone/i })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens default archive groups and keeps the rest collapsed', () => {
    renderWithTheme(
      <JobAdsArchivedAdList
        groups={[
          {
            archiveReason: 'unmet-requirements',
            ads: [jobAd({ id: '1', title: 'Unmet Role' })],
          },
          {
            archiveReason: 'other',
            ads: [jobAd({ id: '2', title: 'Skipped Role' })],
          },
        ]}
        zoom={true}
        onFav={noop}
        onUnfav={noop}
        onAnalyzeCvMatch={noop}
      />,
    )

    expect(screen.getByRole('button', { name: /Niespełnione wymagania/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Inny/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Unmet Role')).toBeInTheDocument()
  })

  it('collapses a section when its summary is clicked', () => {
    renderWithTheme(
      <JobAdsArchivedAdList
        groups={[
          {
            archiveReason: 'no-response',
            ads: [jobAd({ id: '4', title: 'No Response Role' })],
          },
        ]}
        zoom={true}
        onFav={noop}
        onUnfav={noop}
        onAnalyzeCvMatch={noop}
      />,
    )

    const summary = screen.getByRole('button', { name: /Brak odpowiedzi/i })

    expect(summary).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('No Response Role')).toBeInTheDocument()

    fireEvent.click(summary)

    expect(summary).toHaveAttribute('aria-expanded', 'false')
  })
})
