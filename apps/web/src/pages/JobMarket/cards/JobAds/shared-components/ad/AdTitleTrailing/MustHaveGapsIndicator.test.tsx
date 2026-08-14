import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { jobAd, matchAnalysis } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderWithTheme } from '@/test/test-utils'
import { MustHaveGapsIndicator } from './MustHaveGapsIndicator'

describe('MustHaveGapsIndicator', () => {
  it('renders icon and count when mustHaveGaps has items', () => {
    renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysis: matchAnalysis({
            analyzedAt: '2026-01-01T00:00:00.000Z',
            mustHaveGaps: ['Req A', 'Req B'],
          }),
        })}
      />,
    )

    expect(screen.getByLabelText('2 brakujących wymagań must-have')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('returns null when mustHaveGaps is undefined', () => {
    const { container } = renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z' }),
        })}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders green checkmark when mustHaveGaps is empty', () => {
    renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysis: matchAnalysis({
            analyzedAt: '2026-01-01T00:00:00.000Z',
            mustHaveGaps: [],
          }),
        })}
      />,
    )

    expect(screen.getByLabelText('Brak luk must-have')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('returns null when matchAnalysis is null', () => {
    const { container } = renderWithTheme(
      <MustHaveGapsIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          matchAnalysis: null,
        })}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
