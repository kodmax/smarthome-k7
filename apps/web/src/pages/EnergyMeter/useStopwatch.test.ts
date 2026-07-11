import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStopwatch } from './useStopwatch'
import type { MeterStatus } from './types'

describe('useStopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const advance = (ms: number) => {
    act(() => {
      vi.advanceTimersByTime(ms)
    })
  }

  const rerenderWithStatus = (rerender: (props: { status: MeterStatus }) => void, status: MeterStatus) => {
    act(() => {
      rerender({ status })
    })
  }

  it('starts at 0 when mounted in reset', () => {
    const { result } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'reset' as MeterStatus },
    })

    expect(result.current).toBe(0)
  })

  it('starts at 0 when mounted in stopped without prior run', () => {
    const { result } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'stopped' as MeterStatus },
    })

    expect(result.current).toBe(0)
  })

  it('counts elapsed seconds while started', () => {
    const { result } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(2500)

    expect(result.current).toBe(2)
  })

  it('resets to 0 when status changes to reset', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(5000)
    expect(result.current).toBe(5)

    rerenderWithStatus(rerender, 'reset')

    expect(result.current).toBe(0)
  })

  it('pauses and keeps elapsed time when status changes to stopped', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(3000)
    expect(result.current).toBe(3)

    rerenderWithStatus(rerender, 'stopped')
    advance(5000)

    expect(result.current).toBe(3)
  })

  it('floors to 3 seconds when stopped at 3800ms between second ticks', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(3800)

    expect(result.current).toBe(3)

    rerenderWithStatus(rerender, 'stopped')
    advance(10_000)

    expect(result.current).toBe(3)
  })

  it('resumes from paused elapsed time when started again after stop', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(4000)
    rerenderWithStatus(rerender, 'stopped')

    expect(result.current).toBe(4)

    rerenderWithStatus(rerender, 'started')
    advance(2000)

    expect(result.current).toBe(6)
  })

  it('resumes correctly after stopping at 3800ms', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(3800)
    rerenderWithStatus(rerender, 'stopped')

    expect(result.current).toBe(3)

    rerenderWithStatus(rerender, 'started')
    advance(2200)

    expect(result.current).toBe(6)
  })

  it('starts from 0 when started after reset', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(7000)
    rerenderWithStatus(rerender, 'reset')
    rerenderWithStatus(rerender, 'started')
    advance(1000)

    expect(result.current).toBe(1)
  })

  it('clears elapsed time when reset after stop', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(2000)
    rerenderWithStatus(rerender, 'stopped')
    rerenderWithStatus(rerender, 'reset')

    expect(result.current).toBe(0)
  })

  it('does not count while staying in reset', () => {
    const { result } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'reset' as MeterStatus },
    })

    advance(10_000)

    expect(result.current).toBe(0)
  })

  it('does not count while staying in stopped', () => {
    const { result } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'stopped' as MeterStatus },
    })

    advance(10_000)

    expect(result.current).toBe(0)
  })

  it('handles reset -> stopped -> started as a fresh run', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'reset' as MeterStatus },
    })

    rerenderWithStatus(rerender, 'stopped')
    rerenderWithStatus(rerender, 'started')
    advance(1500)

    expect(result.current).toBe(1)
  })

  it('handles started -> reset -> stopped without counting', () => {
    const { result, rerender } = renderHook(({ status }) => useStopwatch(status), {
      initialProps: { status: 'started' as MeterStatus },
    })

    advance(3000)
    rerenderWithStatus(rerender, 'reset')
    rerenderWithStatus(rerender, 'stopped')
    advance(5000)

    expect(result.current).toBe(0)
  })
})
