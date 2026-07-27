import { createSilentLogger } from '@repo/logger'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Chronos } from './Chronos'

describe('Chronos', () => {
  let chronos: Chronos | undefined

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T11:59:55.000'))
  })

  afterEach(() => {
    chronos?.stop()
    chronos = undefined
    vi.useRealTimers()
  })

  it('runs a job when the cron schedule matches the tick time', async () => {
    const script = vi.fn(async () => {})
    chronos = new Chronos()
    chronos.addJob('0 12 1 1 1', 'scheduled', script)

    await vi.advanceTimersByTimeAsync(10_000)

    expect(script).toHaveBeenCalledTimes(1)
  })

  it('skips execution when the previous run is still in progress', async () => {
    const logger = createSilentLogger()
    const warnSpy = vi.spyOn(logger, 'warn')

    const script = vi.fn(() => new Promise<void>(() => {}))
    chronos = new Chronos(logger)
    chronos.addJob('* * * * *', 'slow', script)

    await vi.advanceTimersByTimeAsync(10_000)
    expect(script).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(60_000)
    expect(script).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('still running'))
  })

  it('does not schedule further ticks after stop()', async () => {
    const script = vi.fn(async () => {})
    chronos = new Chronos()
    chronos.addJob('* * * * *', 'stopped', script)
    chronos.stop()

    await vi.advanceTimersByTimeAsync(120_000)

    expect(script).not.toHaveBeenCalled()
  })
})
