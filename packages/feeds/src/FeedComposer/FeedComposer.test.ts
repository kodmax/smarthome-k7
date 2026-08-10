import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeedEvents } from './FeedEvents'
import { FSCache } from '../Cache'
import { FeedComposer } from './FeedComposer'
import { DataSource, DataSourceCtor, DataSourceParams } from '../DataSource'
import type { CacheEntry } from '../Cache'
import { createSilentLogger } from '@repo/logger'

const noopOnError = (): void => void 0

function waitForDataUpdate(vent: FeedEvents, sourceId: string): Promise<void> {
  return new Promise(resolve => {
    const listener = (id: string) => {
      if (id === sourceId) {
        vent.removeListener('data-update', listener)
        resolve()
      }
    }
    vent.on('data-update', listener)
  })
}

function createTestSourceClass<T>(options: {
  id: string
  getCacheTTL?: () => number
  fetchData?: () => Promise<T>
  isVolatile?: boolean
  onInit?: (ctx: { push: (content?: T) => void }) => void
  maintenance?: () => void | Promise<void>
}): DataSourceCtor<T> {
  class TestSource extends DataSource<T> {
    public static getId(): string {
      return options.id
    }

    public static getCacheTTL(): number {
      return options.getCacheTTL?.() ?? 0
    }

    public static isVolatile(): boolean {
      return options.isVolatile ?? false
    }

    public constructor(params: DataSourceParams<T>) {
      super(params)
      options.onInit?.({ push: content => void this.push(content) })
    }

    protected async fetchData(): Promise<T> {
      return options.fetchData !== undefined ? await options.fetchData() : ({ value: 1 } as T)
    }

    public async maintenance(): Promise<void> {
      await options.maintenance?.()
    }
  }

  return TestSource
}

async function createDataSource<T>(cache: FSCache, vent: FeedEvents, SourceClass: DataSourceCtor<T>) {
  const cacheEntry = await cache.getEntry(SourceClass.isVolatile() ? undefined : SourceClass.getId(), {
    ttlMs: SourceClass.getCacheTTL(),
  })
  return new SourceClass({
    feedEvents: vent,
    cacheEntry: cacheEntry as CacheEntry<T>,
    logger: createSilentLogger(),
    onError: noopOnError,
  })
}

describe('Feeds data source registration', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createFeeds(onError = noopOnError) {
    const cacheDir = mkdtempSync(join(tmpdir(), 'feeds-'))
    cacheDirs.push(cacheDir)

    return {
      cache: new FSCache(cacheDir),
      vent: new FeedEvents(),
      feeds: new FeedComposer(new FeedEvents(), { logger: createSilentLogger(), onError }),
    }
  }

  it('reuses the same DataSource instance when passed explicitly to multiple feeds', async () => {
    const { cache, vent, feeds } = createFeeds()
    const SourceClass = createTestSourceClass({ id: 'shared-source' })
    const shared = await createDataSource(cache, vent, SourceClass)

    await feeds.addFeed('feed-a', { src: shared }, ({ src }) => src)
    await feeds.addFeed('feed-b', { src: shared }, ({ src }) => src)

    await expect(feeds.addFeed('feed-c', { src: shared }, ({ src }) => src)).resolves.toBeUndefined()
  })

  it('allows different ids for different data source instances', async () => {
    const { cache, vent, feeds } = createFeeds()

    await feeds.addFeed(
      'feed-a',
      { src: await createDataSource(cache, vent, createTestSourceClass({ id: 'source-a' })) },
      ({ src }) => src,
    )
    await feeds.addFeed(
      'feed-b',
      { src: await createDataSource(cache, vent, createTestSourceClass({ id: 'source-b' })) },
      ({ src }) => src,
    )
  })
})

const FRESH_CACHE_TTL_MS = 3_600_000

describe('Feeds composition', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createCompositionFeeds() {
    const vent = new FeedEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'feeds-'))
    cacheDirs.push(cacheDir)
    const cache = new FSCache(cacheDir)

    const feeds = new FeedComposer(vent, {
      logger: createSilentLogger(),
      onError: noopOnError,
    })

    return { vent, feeds, cache }
  }

  describe('data-update notifications', () => {
    it('emits feed-changed for feeds containing the updated source', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      await feeds.addFeed(
        'composed',
        {
          a: await createDataSource(cache, vent, createTestSourceClass({ id: 'source-a', isVolatile: true })),
          b: await createDataSource(cache, vent, createTestSourceClass({ id: 'source-b', isVolatile: true })),
        },
        content => content,
      )

      const changed: string[] = []
      vent.on('feed-changed', feedId => changed.push(feedId))

      vent.emit('data-update', 'source-a')

      expect(changed).toEqual(['composed'])
    })

    it('does not emit feed-changed for unrelated feeds', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      await feeds.addFeed(
        'other-feed',
        { src: await createDataSource(cache, vent, createTestSourceClass({ id: 'other-src', isVolatile: true })) },
        ({ src }) => src,
      )

      const changed: string[] = []
      vent.on('feed-changed', feedId => changed.push(feedId))

      vent.emit('data-update', 'missing-source')

      expect(changed).toEqual([])
    })
  })

  describe('getFeedData via ensureContent', () => {
    it('reads cached content after push without calling fetchData again', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushSrc: (content: { value: number }) => void = () => {}
      const fetchData = vi.fn(async () => ({ value: 10 }))
      const Source = createTestSourceClass({
        id: 'cached-src',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        fetchData,
        onInit: ({ push }) => {
          pushSrc = push
        },
      })

      await feeds.addFeed('cached-feed', { src: await createDataSource(cache, vent, Source) }, ({ src }) => src)

      const ready = waitForDataUpdate(vent, 'cached-src')
      pushSrc({ value: 42 })
      await ready

      fetchData.mockClear()

      await expect(feeds.getFeedData('cached-feed')).resolves.toEqual({ value: 42 })
      expect(fetchData).not.toHaveBeenCalled()
    })

    it('fetches cold sibling via ensureContent without emitting data-update', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushWarm: (content: { value: number }) => void = () => {}
      const fetchCold = vi.fn(async () => ({ value: 99 }))
      const WarmSource = createTestSourceClass({
        id: 'warm',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        onInit: ({ push }) => {
          pushWarm = push
        },
      })
      const ColdSource = createTestSourceClass({
        id: 'cold',
        isVolatile: true,
        fetchData: fetchCold,
      })

      await feeds.addFeed(
        'mixed-feed',
        {
          warm: await createDataSource(cache, vent, WarmSource),
          cold: await createDataSource(cache, vent, ColdSource),
        },
        content => content,
      )

      const dataUpdates: string[] = []
      vent.on('data-update', sourceId => dataUpdates.push(sourceId))

      const warmReady = waitForDataUpdate(vent, 'warm')
      pushWarm({ value: 1 })
      await warmReady

      fetchCold.mockClear()
      dataUpdates.length = 0

      await expect(feeds.getFeedData('mixed-feed')).resolves.toEqual({ warm: { value: 1 }, cold: { value: 99 } })
      expect(fetchCold).toHaveBeenCalledOnce()
      expect(dataUpdates).toEqual([])
    })
  })
})

describe('getFeedData', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createCompositionFeeds() {
    const vent = new FeedEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'feeds-'))
    cacheDirs.push(cacheDir)
    const cache = new FSCache(cacheDir)

    const feeds = new FeedComposer(vent, {
      logger: createSilentLogger(),
      onError: noopOnError,
    })

    return { vent, feeds, cache }
  }

  it('returns composed payload from cached source content', async () => {
    const { vent, feeds, cache } = createCompositionFeeds()

    let pushSrc: (content: { value: number }) => void = () => {}
    const Source = createTestSourceClass({
      id: 'get-feed-src',
      isVolatile: true,
      getCacheTTL: () => FRESH_CACHE_TTL_MS,
      onInit: ({ push }) => {
        pushSrc = push
      },
    })

    await feeds.addFeed('get-feed', { src: await createDataSource(cache, vent, Source) }, ({ src }) => ({
      reading: src.value,
    }))

    const sourceReady = waitForDataUpdate(vent, 'get-feed-src')
    pushSrc({ value: 42 })
    await sourceReady

    await expect(feeds.getFeedData('get-feed')).resolves.toEqual({ reading: 42 })
  })

  it('returns JSON-serializable payload', async () => {
    const { vent, feeds, cache } = createCompositionFeeds()

    await feeds.addFeed(
      'ws-feed',
      {
        src: await createDataSource(
          cache,
          vent,
          createTestSourceClass({ id: 'ws-src', fetchData: async () => ({ value: 7 }) }),
        ),
      },
      ({ src }) => src,
    )

    const data = await feeds.getFeedData('ws-feed')
    const payload = JSON.parse(JSON.stringify(data))

    expect(payload).toEqual({ value: 7 })
  })

  it('throws for an unknown feed id', async () => {
    const { feeds } = createCompositionFeeds()

    await expect(feeds.getFeedData('missing-feed')).rejects.toThrow('Feed not found: missing-feed')
  })

  it('coalesces concurrent getFeedData calls into one composition', async () => {
    const { vent, feeds, cache } = createCompositionFeeds()

    let resolveFetch!: (value: { value: number }) => void
    const fetchData = vi.fn(
      () =>
        new Promise<{ value: number }>(resolve => {
          resolveFetch = resolve
        }),
    )

    await feeds.addFeed(
      'coalesce-feed',
      {
        src: await createDataSource(
          cache,
          vent,
          createTestSourceClass({ id: 'coalesce-src', isVolatile: true, fetchData }),
        ),
      },
      ({ src }) => src,
    )

    const resultsPromise = Promise.all([
      feeds.getFeedData('coalesce-feed'),
      feeds.getFeedData('coalesce-feed'),
      feeds.getFeedData('coalesce-feed'),
    ])

    await vi.waitFor(() => expect(fetchData).toHaveBeenCalledOnce())

    resolveFetch({ value: 99 })

    const results = await resultsPromise

    expect(results).toEqual([{ value: 99 }, { value: 99 }, { value: 99 }])
    expect(results[0]).toBe(results[1])
    expect(results[0]).toBe(results[2])
  })

  it('shares rejection across concurrent getFeedData calls', async () => {
    const { feeds } = createCompositionFeeds()

    const results = await Promise.allSettled([
      feeds.getFeedData('missing-feed'),
      feeds.getFeedData('missing-feed'),
      feeds.getFeedData('missing-feed'),
    ])

    expect(results).toEqual([
      {
        status: 'rejected',
        reason: expect.objectContaining({
          message: 'Feed not found: missing-feed',
          feedId: 'missing-feed',
          name: 'FeedNotFound',
        }),
      },
      {
        status: 'rejected',
        reason: expect.objectContaining({
          message: 'Feed not found: missing-feed',
          feedId: 'missing-feed',
          name: 'FeedNotFound',
        }),
      },
      {
        status: 'rejected',
        reason: expect.objectContaining({
          message: 'Feed not found: missing-feed',
          feedId: 'missing-feed',
          name: 'FeedNotFound',
        }),
      },
    ])
  })

  it('reuses cached content on subsequent getFeedData calls', async () => {
    const { vent, feeds, cache } = createCompositionFeeds()

    const fetchData = vi.fn(async () => ({ value: 1 }))

    await feeds.addFeed(
      'sequential-feed',
      {
        src: await createDataSource(
          cache,
          vent,
          createTestSourceClass({ id: 'sequential-src', isVolatile: true, fetchData }),
        ),
      },
      ({ src }) => src,
    )

    await feeds.getFeedData('sequential-feed')
    await feeds.getFeedData('sequential-feed')

    expect(fetchData).toHaveBeenCalledOnce()
  })
})
