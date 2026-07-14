import { act, renderWithTheme } from '@/test/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ActiveAppHint } from './appHintTypes'
import { AppHintView } from './AppHint'

const hintA: ActiveAppHint = {
  id: 1,
  content: {
    title: 'Pierwszy hint',
    description: 'Opis pierwszego',
    icon: null,
  },
}

const hintB: ActiveAppHint = {
  id: 2,
  content: {
    title: 'Drugi hint',
    description: 'Opis drugiego',
    icon: null,
  },
}

describe('AppHint', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onDismiss after the dismiss delay', () => {
    const onDismiss = vi.fn()

    renderWithTheme(<AppHintView hint={hintA} dismissMs={8_000} onDismiss={onDismiss} />)

    act(() => {
      vi.advanceTimersByTime(8_000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('resets the dismiss timer when a new hint replaces the current one', () => {
    const onDismiss = vi.fn()

    const { rerender } = renderWithTheme(<AppHintView hint={hintA} dismissMs={8_000} onDismiss={onDismiss} />)

    act(() => {
      vi.advanceTimersByTime(7_000)
    })

    rerender(<AppHintView hint={hintB} dismissMs={8_000} onDismiss={onDismiss} />)

    act(() => {
      vi.advanceTimersByTime(7_000)
    })

    expect(onDismiss).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('calls onDismiss when the hint card is clicked', () => {
    const onDismiss = vi.fn()

    renderWithTheme(<AppHintView hint={hintA} dismissMs={8_000} onDismiss={onDismiss} />)

    fireEvent.click(screen.getByRole('status'))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
