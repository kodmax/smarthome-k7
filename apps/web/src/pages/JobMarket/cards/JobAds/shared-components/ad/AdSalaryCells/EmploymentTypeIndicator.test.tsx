import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '@/i18n'
import { EmploymentTypeIndicator } from './EmploymentTypeIndicator'

function renderIndicator(employmentType: 'permanent' | 'b2b' | 'any') {
  return render(
    <I18nProvider initialLocale='pl'>
      <EmploymentTypeIndicator employmentType={employmentType} />
    </I18nProvider>,
  )
}

describe('EmploymentTypeIndicator', () => {
  it('shows UoP label for permanent employment', () => {
    renderIndicator('permanent')

    expect(screen.getByLabelText('UoP')).toBeInTheDocument()
  })

  it('shows B2B label for b2b employment', () => {
    renderIndicator('b2b')

    expect(screen.getByLabelText('B2B')).toBeInTheDocument()
  })

  it('shows combined label for any employment', () => {
    renderIndicator('any')

    expect(screen.getByLabelText('UoP / B2B')).toBeInTheDocument()
  })
})
