import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeedEvents, FeedManager } from '../FeedManager'
import { FSCache } from '../Cache'
import { DataSource } from './DataSource'
import { createSilentLogger } from '@repo/logger'
import { DataSourceCtor, DataSourceParams, SourceMetricType, DataSourceRefreshObserver } from './types'

const noopOnError = (): void => void 0

function createTestSourceClass<T, TCache = T>(options: {
  id: string
  getCacheTTL?: () => number
  isCacheValid?: (cached: TCache) => boolean
  fetchData?: () => Promise<TCache>
  composeContent?: (cached: TCache) => Promise<T>
  isVolatile?: boolean
  getSourceMetricType?: () => SourceMetricType
  isMetricsEnabled?: () => boolean
  handleCommand?: (command: string, args: string) => void | Promise<void>
  maintenance?: () => void | Promise<void>
}): DataSourceCtor<T, TCache> {
  class TestSource extends DataSource<T, TCache> {
    public static getId(): string {
      return options.id
    }

    public static getCacheTTL(): number {
      return options.getCacheTTL?.() ?? 0
    }

    public static isVolatile(): boolean {
      return options.isVolatile ?? false
    }

    public async handleCommand(command: string, args: string): Promise<void> {
      await options.handleCommand?.(command, args)
    }

    protected isCacheValid(cached: TCache): boolean {
      return options.isCacheValid?.(cached) ?? true
    }

    protected async fetchData(): Promise<TCache> {
      return options.fetchData !== undefined ? await options.fetchData() : ({ value: 1 } as TCache)
    }

    protected async composeContent(cached: TCache): Promise<T> {
      return options.composeContent !== undefined
        ? await options.composeContent(cached)
        : await super.composeContent(cached)
    }

    protected getSourceMetricType(): SourceMetricType {
      return options.getSourceMetricType?.() ?? 'other'
    }

    protected isMetricsEnabled(): boolean {
      return options.isMetricsEnabled?.() ?? true
    }

    public async maintenance(): Promise<void> {
      await options.maintenance?.()
    }
  }

  return TestSource
}

describe('DataSource', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    vi.useRealTimers()
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  async function createDataSource<T, TCache = T>(
    SourceClass: DataSourceCtor<T, TCache>,
    onError = noopOnError,
    observeDataSourceRefresh?: DataSourceRefreshObserver,
  ) {
    const cacheDir = mkdtempSync(join(tmpdir(), 'ds-'))
    cacheDirs.push(cacheDir)

    const vent = new FeedEvents()
    const cache = new FSCache(cacheDir)
    const cacheEntry = await cache.getEntry(SourceClass.isVolatile() ? undefined : SourceClass.getId(), {
      ttlMs: SourceClass.getCacheTTL(),
    })
    const dataSource = new SourceClass({
      feedEvents: vent,
      cacheEntry,
      logger: createSilentLogger(),
      onError,
      observeDataSourceRefresh,
    })

    return {
      dataSource,
      vent,
    }
  }

  it('returns cached content on cache hit without calling script', async () => {
    const fetchData = vi.fn(async () => ({ value: 99 }))
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'cache-hit',
        getCacheTTL: () => Number.MAX_SAFE_INTEGER,
        fetchData,
      }),
    )

    await dataSource.getData()
    fetchData.mockClear()

    await expect(dataSource.getData()).resolves.toEqual({ value: 99 })
    expect(fetchData).not.toHaveBeenCalled()
  })

  it('refetches after cache TTL expires', async () => {
    vi.useFakeTimers()

    const fetchData = vi.fn().mockResolvedValueOnce({ value: 1 }).mockResolvedValueOnce({ value: 2 })
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'ttl-expire',
        getCacheTTL: () => 1000,
        fetchData,
      }),
    )

    await expect(dataSource.getData()).resolves.toEqual({ value: 1 })
    expect(fetchData).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1001)

    await expect(dataSource.getData()).resolves.toEqual({ value: 2 })
    expect(fetchData).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  it('calls script on cache miss and on force refresh', async () => {
    const fetchData = vi.fn(async () => ({ value: 42 }))
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'cache-miss',
        fetchData,
      }),
    )

    await expect(dataSource.getData()).resolves.toEqual({ value: 42 })
    expect(fetchData).toHaveBeenCalledTimes(1)

    fetchData.mockClear()
    await dataSource.getData()
    expect(fetchData).toHaveBeenCalledTimes(1)

    fetchData.mockClear()
    await expect(dataSource.getData(true)).resolves.toEqual({ value: 42 })
    expect(fetchData).toHaveBeenCalledTimes(1)
  })

  it('deduplicates concurrent getData() calls', async () => {
    vi.useFakeTimers()

    const fetchData = vi.fn(
      () =>
        new Promise<{ value: number }>(resolve => {
          setTimeout(() => resolve({ value: 7 }), 50)
        }),
    )
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'dedup',
        fetchData,
      }),
    )

    const first = dataSource.getData()
    const second = dataSource.getData()

    expect(fetchData).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    await expect(first).resolves.toEqual({ value: 7 })
    await expect(second).resolves.toEqual({ value: 7 })

    vi.useRealTimers()
  })

  it('emits data-update after push', async () => {
    const updates: string[] = []
    const { dataSource, vent } = await createDataSource(
      createTestSourceClass({
        id: 'push-src',
        isVolatile: true,
      }),
    )

    vent.on('data-update', sourceId => updates.push(sourceId))

    await dataSource.push({ value: 123 })

    expect(updates).toEqual(['push-src'])
    await expect(dataSource.getRecentContent()).resolves.toEqual({ value: 123 })
  })

  it('returns null when cache is empty', async () => {
    const { dataSource } = await createDataSource(createTestSourceClass({ id: 'empty' }))

    await expect(dataSource.getRecentContent()).resolves.toBeNull()
  })

  it('calls composeContent on cache hit without calling fetchData again', async () => {
    const fetchData = vi.fn(async () => ({ value: 5 }))
    const composeContent = vi.fn(async (cached: { value: number }) => ({ value: cached.value, meta: 'fresh' }))
    const { dataSource } = await createDataSource(
      createTestSourceClass<{ value: number; meta: string }, { value: number }>({
        id: 'compose-hit',
        getCacheTTL: () => Number.MAX_SAFE_INTEGER,
        fetchData,
        composeContent,
      }),
    )

    await dataSource.getData()
    fetchData.mockClear()
    composeContent.mockClear()

    await expect(dataSource.getData()).resolves.toEqual({ value: 5, meta: 'fresh' })
    expect(fetchData).not.toHaveBeenCalled()
    expect(composeContent).toHaveBeenCalledTimes(1)
    expect(composeContent).toHaveBeenCalledWith({ value: 5 })
  })

  it('emits data-update on push without content without changing cache', async () => {
    const updates: string[] = []
    let pushWithoutContent: () => void = () => {}

    class NotifySource extends DataSource<{ value: number }> {
      public static getId(): string {
        return 'notify-src'
      }

      public static getCacheTTL(): number {
        return Number.MAX_SAFE_INTEGER
      }

      public constructor(params: DataSourceParams<{ value: number }>) {
        super(params)
        pushWithoutContent = () => {
          void this.push()
        }
      }

      protected async fetchData(): Promise<{ value: number }> {
        return { value: 1 }
      }
    }

    const cacheDir = mkdtempSync(join(tmpdir(), 'ds-'))
    cacheDirs.push(cacheDir)
    const vent = new FeedEvents()
    const cache = new FSCache(cacheDir)
    const cacheEntry = await cache.getEntry(NotifySource.getId(), { ttlMs: NotifySource.getCacheTTL() })
    const dataSource = new NotifySource({
      feedEvents: vent,
      cacheEntry,
      logger: createSilentLogger(),
      onError: noopOnError,
    })
    const feeds = new FeedManager(vent, { logger: createSilentLogger(), onError: noopOnError })
    await feeds.addFeed('notify', { src: dataSource }, ({ src }) => src)

    vent.on('data-update', sourceId => updates.push(sourceId))
    await dataSource.getData()
    updates.length = 0

    pushWithoutContent()
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(updates).toEqual(['notify-src'])
    await expect(dataSource.getRecentContent()).resolves.toEqual({ value: 1 })
  })

  it('calls maintenance hook', async () => {
    const maintenance = vi.fn(async () => {})
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'maint-src',
        maintenance,
      }),
    )

    await dataSource.maintenance()

    expect(maintenance).toHaveBeenCalledTimes(1)
  })

  it('uses default no-op maintenance when not overridden', async () => {
    const { dataSource } = await createDataSource(createTestSourceClass({ id: 'maint-default' }))

    await expect(dataSource.maintenance()).resolves.toBeUndefined()
  })

  it('ensureContent returns cached content without calling script', async () => {
    const fetchData = vi.fn(async () => ({ value: 11 }))
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'ensure-hit',
        getCacheTTL: () => Number.MAX_SAFE_INTEGER,
        fetchData,
      }),
    )

    await dataSource.getData()
    fetchData.mockClear()

    await expect(dataSource.ensureContent()).resolves.toEqual({ value: 11 })
    expect(fetchData).not.toHaveBeenCalled()
  })

  it('ensureContent fetches and writes cache when snapshot is missing', async () => {
    const fetchData = vi.fn(async () => ({ value: 22 }))
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'ensure-miss',
        fetchData,
      }),
    )

    await expect(dataSource.ensureContent()).resolves.toEqual({ value: 22 })
    expect(fetchData).toHaveBeenCalledTimes(1)
    await expect(dataSource.getRecentContent()).resolves.toEqual({ value: 22 })
  })

  it('ensureContent does not emit data-update on fetch', async () => {
    const updates: string[] = []
    const fetchData = vi.fn(async () => ({ value: 33 }))
    const { dataSource, vent } = await createDataSource(
      createTestSourceClass({
        id: 'ensure-silent',
        fetchData,
      }),
    )

    vent.on('data-update', sourceId => updates.push(sourceId))

    await expect(dataSource.ensureContent()).resolves.toEqual({ value: 33 })
    expect(fetchData).toHaveBeenCalledTimes(1)
    expect(updates).toEqual([])
  })

  it('getData still emits data-update after fetch', async () => {
    const updates: string[] = []
    const { dataSource, vent } = await createDataSource(
      createTestSourceClass({
        id: 'getdata-emit',
        fetchData: async () => ({ value: 44 }),
      }),
    )

    vent.on('data-update', sourceId => updates.push(sourceId))

    await dataSource.getData()

    expect(updates).toEqual(['getdata-emit'])
  })

  it('calls observeDataSourceRefresh when metrics are enabled', async () => {
    const fetchData = vi.fn(async () => ({ value: 1 }))
    const observeDataSourceRefresh = vi.fn(async (_metricType, _sourceId, fn) => fn())
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'metrics-src',
        getSourceMetricType: () => 'api',
        fetchData,
      }),
      noopOnError,
      observeDataSourceRefresh,
    )

    await expect(dataSource.getData()).resolves.toEqual({ value: 1 })
    expect(observeDataSourceRefresh).toHaveBeenCalledOnce()
    expect(observeDataSourceRefresh).toHaveBeenCalledWith('api', 'metrics-src', expect.any(Function))
    expect(fetchData).toHaveBeenCalledOnce()
  })

  it('skips observeDataSourceRefresh when metrics are disabled', async () => {
    const fetchData = vi.fn(async () => ({ value: 1 }))
    const observeDataSourceRefresh = vi.fn(async (_metricType, _sourceId, fn) => fn())
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'no-metrics-src',
        isMetricsEnabled: () => false,
        fetchData,
      }),
      noopOnError,
      observeDataSourceRefresh,
    )

    await expect(dataSource.getData()).resolves.toEqual({ value: 1 })
    expect(observeDataSourceRefresh).not.toHaveBeenCalled()
    expect(fetchData).toHaveBeenCalledOnce()
  })

  it('calls onError when getData fails', async () => {
    const onError = vi.fn()
    const failure = new Error('fetch failed')
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'getdata-fail',
        fetchData: async () => {
          throw failure
        },
      }),
      onError,
    )

    await expect(dataSource.getData()).rejects.toThrow('fetch failed')
    expect(onError).toHaveBeenCalledWith(failure, 'Data source update error')
  })

  it('emits error event from reportError', async () => {
    const onError = vi.fn()
    const failure = new Error('push failed')

    class PushFailSource extends DataSource<{ value: number }> {
      public static getId(): string {
        return 'push-fail'
      }

      public static getCacheTTL(): number {
        return 0
      }

      public constructor(params: DataSourceParams<{ value: number }>) {
        super(params)
        queueMicrotask(() => this.reportError(failure))
      }

      protected async fetchData(): Promise<{ value: number }> {
        return { value: 1 }
      }
    }

    const vent = new FeedEvents()
    vent.on('error', (_sourceId, error, context) => {
      onError(error, context)
    })

    const cacheDir = mkdtempSync(join(tmpdir(), 'ds-'))
    cacheDirs.push(cacheDir)
    const cache = new FSCache(cacheDir)
    const cacheEntry = await cache.getEntry(PushFailSource.getId(), { ttlMs: PushFailSource.getCacheTTL() })
    new PushFailSource({
      feedEvents: vent,
      cacheEntry,
      logger: createSilentLogger(),
      onError: noopOnError,
    })
    await new Promise<void>(resolve => queueMicrotask(() => resolve()))

    expect(onError).toHaveBeenCalledWith(failure, 'Push data source update error')
  })
})
