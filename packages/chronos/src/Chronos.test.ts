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

  it('passes script result to consume with run context', async () => {
    const script = vi.fn(async () => ({ value: 42 }))
    const consume = vi.fn(async () => {})
    chronos = new Chronos()
    chronos.addJob({
      namespace: 'test',
      id: 'with-consume',
      cron: '0 12 1 1 1',
      script,
      consume,
    })

    await vi.advanceTimersByTimeAsync(10_000)

    expect(script).toHaveBeenCalledTimes(1)
    expect(consume).toHaveBeenCalledWith(
      { value: 42 },
      {
        scheduledAt: new Date('2024-01-01T12:00:00.000'),
        attempt: 1,
        namespace: 'test',
        id: 'with-consume',
        jobId: 'test:with-consume',
      },
    )
  })

  it('retries script and consume when consume fails', async () => {
    const script = vi.fn(async () => 'result')
    const consume = vi
      .fn<(result: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error('consume fail'))
      .mockResolvedValueOnce(undefined)

    chronos = new Chronos()
    chronos.addJob({
      namespace: 'test',
      id: 'consume-retry',
      cron: '0 12 1 1 1',
      script,
      consume,
      policy: {
        retry: { maxAttempts: 2, delaySec: 5 * 60 },
      },
    })

    await vi.advanceTimersByTimeAsync(10_000)
    expect(script).toHaveBeenCalledTimes(1)
    expect(consume).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5 * 60_000)
    expect(script).toHaveBeenCalledTimes(2)
    expect(consume).toHaveBeenCalledTimes(2)
  })

  it('does not record success when consume fails under misfire policy', async () => {
    const store: CronExecutionStore = {
      getLastSuccessfulOccurrence: vi.fn(async () => undefined),
      recordSuccessfulOccurrence: vi.fn(async () => {}),
    }

    const script = vi.fn(async () => 'result')
    const consume = vi.fn(async () => {
      throw new Error('consume fail')
    })

    chronos = new Chronos({ executionStore: store })
    chronos.addJob({
      namespace: 'test',
      id: 'consume-fail',
      cron: '0 12 1 1 1',
      script,
      consume,
      policy: {
        misfirePolicy: 'run-latest',
        retry: { maxAttempts: 1, delaySec: 5 * 60 },
      },
    })

    await vi.advanceTimersByTimeAsync(10_000)

    expect(store.recordSuccessfulOccurrence).not.toHaveBeenCalled()
  })

  it('does not run consume when replace supersedes the script run', async () => {
    vi.setSystemTime(new Date('2024-01-01T11:59:55.000'))

    let resolveFirst: (() => void) | undefined
    const script = vi.fn(
      () =>
        new Promise<string>(resolve => {
          if (script.mock.calls.length === 1) {
            resolveFirst = () => resolve('stale')
            return
          }

          resolve('fresh')
        }),
    )
    const consume = vi.fn(async () => {})

    chronos = new Chronos()
    chronos.addJob({
      namespace: 'test',
      id: 'replace-consume',
      cron: '* * * * *',
      script,
      consume,
      policy: { concurrencyPolicy: 'replace' },
    })

    await vi.advanceTimersByTimeAsync(10_000)
    expect(script).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(60_000)
    expect(script).toHaveBeenCalledTimes(2)
    expect(consume).toHaveBeenCalledTimes(1)
    expect(consume).toHaveBeenCalledWith(
      'fresh',
      expect.objectContaining({ attempt: 1, jobId: 'test:replace-consume' }),
    )

    resolveFirst?.()
    await vi.advanceTimersByTimeAsync(0)
    expect(consume).toHaveBeenCalledTimes(1)
  })
})
