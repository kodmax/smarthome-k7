import { act, renderWithTheme } from '@/test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CardHintOverlay } from './CardHintOverlay'
import type { ActiveCardHint } from './cardHintTypes'

const hintA: ActiveCardHint = {
  id: 1,
  content: {
    title: 'Pierwszy hint',
    description: 'Opis pierwszego',
    icon: null,
  },
}

const hintB: ActiveCardHint = {
  id: 2,
  content: {
    title: 'Drugi hint',
    description: 'Opis drugiego',
    icon: null,
  },
}

describe('CardHintOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onDismiss after the dismiss delay', () => {
    const onDismiss = vi.fn()

    renderWithTheme(<CardHintOverlay hint={hintA} dismissMs={8_000} onDismiss={onDismiss} />)

    act(() => {
      vi.advanceTimersByTime(8_000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('resets the dismiss timer when a new hint replaces the current one', () => {
    const onDismiss = vi.fn()

    const { rerender } = renderWithTheme(<CardHintOverlay hint={hintA} dismissMs={8_000} onDismiss={onDismiss} />)

    act(() => {
      vi.advanceTimersByTime(7_000)
    })

    rerender(<CardHintOverlay hint={hintB} dismissMs={8_000} onDismiss={onDismiss} />)

    act(() => {
      vi.advanceTimersByTime(7_000)
    })

    expect(onDismiss).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
