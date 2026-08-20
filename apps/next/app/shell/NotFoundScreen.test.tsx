import { renderWithTheme, screen } from '@/test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { NotFoundScreen } from './NotFoundScreen'

vi.mock('next/navigation', () => ({
  usePathname: () => '/unknown-page',
}))

describe('NotFoundScreen', () => {
  it('renders 404 content and link to dashboard', () => {
    renderWithTheme(<NotFoundScreen />)

    expect(screen.getByRole('heading', { name: 'Strona nie istnieje' })).toBeInTheDocument()
    expect(screen.getByText('/unknown-page')).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: 'Wróć na pulpit' })
    expect(homeLink).toHaveAttribute('href', '/dashboard')
  })
})
