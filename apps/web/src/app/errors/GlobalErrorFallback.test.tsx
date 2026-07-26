import { renderWithTheme, screen } from '@/test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { GlobalErrorFallback } from './GlobalErrorFallback'

describe('GlobalErrorFallback', () => {
  it('renders error message and retry action', () => {
    const onRetry = vi.fn()

    renderWithTheme(<GlobalErrorFallback error={new Error('Boom')} onRetry={onRetry} />)

    expect(screen.getByRole('heading', { name: 'Coś poszło nie tak' })).toBeInTheDocument()
    expect(screen.getByText('Boom')).toBeInTheDocument()

    screen.getByRole('button', { name: 'Spróbuj ponownie' }).click()
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
