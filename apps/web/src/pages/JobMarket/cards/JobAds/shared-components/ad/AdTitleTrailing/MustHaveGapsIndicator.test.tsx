import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { jobAd, matchAnalysisSummary } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderWithTheme } from '@/test/test-utils'
import { MustHaveGapsIndicator } from './MustHaveGapsIndicator'

describe('MustHaveGapsIndicator', () => {
  it('renders icon and count when mustHaveGapsCount is greater than zero', () => {
    renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysisSummary: matchAnalysisSummary({ mustHaveGapsCount: 2 }),
        })}
      />,
    )

    expect(screen.getByLabelText('2 brakujących wymagań must-have')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('returns null when mustHaveGapsCount is undefined', () => {
    const { container } = renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysisSummary: matchAnalysisSummary(),
        })}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders green checkmark when mustHaveGapsCount is zero', () => {
    renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysisSummary: matchAnalysisSummary({ mustHaveGapsCount: 0 }),
        })}
      />,
    )

    expect(screen.getByLabelText('Brak luk must-have')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('returns null when matchAnalysisSummary is null', () => {
    const { container } = renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysisSummary: null,
        })}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
