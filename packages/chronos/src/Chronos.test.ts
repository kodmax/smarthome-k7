import { createSilentLogger } from '@repo/logger'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Chronos } from './Chronos'
import type { CronExecutionStore } from './types'

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
    chronos.addJob({
      namespace: 'test',
      id: 'scheduled',
      cron: '0 12 1 1 1',
      script,
    })

    await vi.advanceTimersByTimeAsync(10_000)

    expect(script).toHaveBeenCalledTimes(1)
  })

  it('skips execution when the previous run is still in progress', async () => {
    const logger = createSilentLogger()
    const warnSpy = vi.spyOn(logger, 'warn')

    const script = vi.fn(() => new Promise<void>(() => {}))
    chronos = new Chronos({ logger })
    chronos.addJob({
      namespace: 'test',
      id: 'slow',
      cron: '* * * * *',
      script,
    })

    await vi.advanceTimersByTimeAsync(10_000)
    expect(script).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(60_000)
    expect(script).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith({ jobId: 'test:slow' }, expect.stringContaining('still running'))
  })

  it('does not schedule further ticks after stop()', async () => {
    const script = vi.fn(async () => {})
    chronos = new Chronos()
    chronos.addJob({
      namespace: 'test',
      id: 'stopped',
      cron: '* * * * *',
      script,
    })
    chronos.stop()

    await vi.advanceTimersByTimeAsync(120_000)

    expect(script).not.toHaveBeenCalled()
  })

  it('retries failed jobs when retry policy is configured', async () => {
    const script = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(undefined)

    chronos = new Chronos()
    chronos.addJob({
      namespace: 'test',
      id: 'retry',
      cron: '0 12 1 1 1',
      script,
      policy: {
        retry: { maxAttempts: 2, delaySec: 5 * 60 },
      },
    })

    await vi.advanceTimersByTimeAsync(10_000)
    expect(script).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5 * 60_000)
    expect(script).toHaveBeenCalledTimes(2)
  })

  it('records successful occurrence when misfire policy requires store', async () => {
    const store: CronExecutionStore = {
      getLastSuccessfulOccurrence: vi.fn(async () => undefined),
      recordSuccessfulOccurrence: vi.fn(async () => {}),
    }

    const script = vi.fn(async () => {})
    chronos = new Chronos({ executionStore: store })
    chronos.addJob({
      namespace: 'data-source',
      id: 'daily',
      cron: '0 12 1 1 1',
      script,
      policy: { misfirePolicy: 'run-latest' },
    })

    await vi.advanceTimersByTimeAsync(10_000)

    expect(store.recordSuccessfulOccurrence).toHaveBeenCalledWith(
      'data-source',
      'daily',
      new Date('2024-01-01T12:00:00.000'),
    )
  })

  it('runMisfireRecovery executes pending slot after last success', async () => {
    vi.setSystemTime(new Date('2024-01-02T21:00:00.000'))

    const store: CronExecutionStore = {
      getLastSuccessfulOccurrence: vi.fn(async () => new Date('2024-01-01T18:05:00.000')),
      recordSuccessfulOccurrence: vi.fn(async () => {}),
    }

    const script = vi.fn(async () => {})
    chronos = new Chronos({ executionStore: store })
    chronos.addJob({
      namespace: 'data-source',
      id: 'job-market-insight',
      cron: '5 18 * * *',
      script,
      policy: { misfirePolicy: 'run-latest' },
    })

    await chronos.runMisfireRecovery()

    expect(script).toHaveBeenCalledTimes(1)
    expect(store.recordSuccessfulOccurrence).toHaveBeenCalledWith(
      'data-source',
      'job-market-insight',
      new Date('2024-01-02T18:05:00.000'),
    )
  })

  it('runMisfireRecovery skips when last success covers latest slot', async () => {
    vi.setSystemTime(new Date('2024-01-02T21:00:00.000'))

    const store: CronExecutionStore = {
      getLastSuccessfulOccurrence: vi.fn(async () => new Date('2024-01-02T18:05:00.000')),
      recordSuccessfulOccurrence: vi.fn(async () => {}),
    }

    const script = vi.fn(async () => {})
    chronos = new Chronos({ executionStore: store })
    chronos.addJob({
      namespace: 'data-source',
      id: 'job-market-insight',
      cron: '5 18 * * *',
      script,
      policy: { misfirePolicy: 'run-latest' },
    })

    await chronos.runMisfireRecovery()

    expect(script).not.toHaveBeenCalled()
  })
})
