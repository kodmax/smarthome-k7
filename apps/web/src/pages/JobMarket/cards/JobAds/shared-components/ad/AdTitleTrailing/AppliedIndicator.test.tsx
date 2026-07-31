import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderWithTheme } from '@/test/test-utils'
import { AppliedIndicator } from './AppliedIndicator'

describe('AppliedIndicator', () => {
  it('shows envelope for applied offers even when status moved past applied', () => {
    renderWithTheme(
      <AppliedIndicator
        ad={jobAd({
          id: '1',
          title: 'Role',
          meta: {
            application: {
              status: 'interview',
              appliedAt: '2026-07-16T08:00:00.000Z',
            },
          },
        })}
      />,
    )

    expect(screen.getByLabelText('Zaaplikowane')).toBeInTheDocument()
  })

  it('does not duplicate envelope when current status is applied', () => {
    renderWithTheme(
      <AppliedIndicator
        ad={jobAd({
          id: '2',
          title: 'Role',
          meta: {
            application: {
              status: 'applied',
              appliedAt: '2026-07-16T08:00:00.000Z',
            },
          },
        })}
      />,
    )

    expect(screen.queryByLabelText('Zaaplikowane')).not.toBeInTheDocument()
  })

  it('does not show envelope when the offer was never applied', () => {
    renderWithTheme(
      <AppliedIndicator
        ad={jobAd({
          id: '3',
          title: 'Role',
          meta: { application: { status: 'consider' } },
        })}
      />,
    )

    expect(screen.queryByLabelText('Zaaplikowane')).not.toBeInTheDocument()
  })
})
