import { renderWithTheme, screen } from '@/test/test-utils'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('renders 404 content and link to dashboard', () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/unknown-page']}>
        <Routes>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Strona nie istnieje' })).toBeInTheDocument()
    expect(screen.getByText('/unknown-page')).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: 'Wróć na pulpit' })
    expect(homeLink).toHaveAttribute('href', '/dashboard')
  })
})
