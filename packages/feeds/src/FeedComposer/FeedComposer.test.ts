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

async function waitForFeedIdle(vent: FeedEvents, feedId: string): Promise<void> {
  await new Promise<void>(resolve => {
    let quietTimer: ReturnType<typeof setTimeout> | undefined

    const onFeed = (id: string) => {
      if (id !== feedId) {
        return
      }

      if (quietTimer !== undefined) {
        clearTimeout(quietTimer)
      }

      quietTimer = setTimeout(() => {
        vent.removeListener('feed', onFeed)
        resolve()
      }, 25)
    }

    vent.on('feed', onFeed)
    quietTimer = setTimeout(() => {
      vent.removeListener('feed', onFeed)
      resolve()
    }, 25)
  })
}

function createTestSourceClass<T>(options: {
  id: string
  getCacheTTL?: () => number
  fetchData?: () => Promise<T>
  isVolatile?: boolean
  onInit?: (ctx: { push: (content?: T) => void }) => void
  handleCommand?: (command: string, args: string) => void | Promise<void>
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

    public async handleCommand(command: string, args: string): Promise<void> {
      await options.handleCommand?.(command, args)
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

  it('routes commands through vent to the push source handler', async () => {
    const commandHandler = vi.fn()
    const vent = new FeedEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'feeds-'))
    cacheDirs.push(cacheDir)
    const cache = new FSCache(cacheDir)
    const feeds = new FeedComposer(vent, {
      logger: createSilentLogger(),
      onError: noopOnError,
    })

    const src = await createDataSource(
      cache,
      vent,
      createTestSourceClass({
        id: 'routed-src',
        isVolatile: true,
        handleCommand: (command, args) => {
          if (command === 'setLevel') {
            commandHandler(args)
          }
        },
      }),
    )

    await feeds.addFeed('routed', { src }, ({ src: routedSrc }) => routedSrc)

    vent.emit('command', { sourceId: 'routed-src', name: 'setLevel', args: '50' })
    vent.emit('command', { sourceId: 'other-src', name: 'setLevel', args: '99' })

    await vi.waitFor(() => expect(commandHandler).toHaveBeenCalledTimes(1))
    expect(commandHandler).toHaveBeenCalledWith('50')
  })

  it('calls onError when command execution fails', async () => {
    const onError = vi.fn()
    const failure = new Error('command failed')
    const vent = new FeedEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'feeds-'))
    cacheDirs.push(cacheDir)
    const cache = new FSCache(cacheDir)
    const feeds = new FeedComposer(vent, { logger: createSilentLogger(), onError })

    const src = await createDataSource(
      cache,
      vent,
      createTestSourceClass({
        id: 'cmd-src',
        handleCommand: async () => {
          throw failure
        },
      }),
    )

    await feeds.addFeed('cmd-feed', { src }, ({ src: cmdSrc }) => cmdSrc)

    vent.emit('command', { sourceId: 'cmd-src', name: 'fail', args: '' })

    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    expect(onError).toHaveBeenCalledWith(failure, 'Data source command execution error')
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

  describe('data-update source selection (triggeredBy)', () => {
    it('reads the trigger source from cache via getRecentContent without re-running getData script', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushA: (content: { value: number }) => void = () => {}
      let pushB: (content: { value: number }) => void = () => {}
      const getDataA = vi.fn(async () => ({ value: 10 }))
      const getDataB = vi.fn(async () => ({ value: 20 }))
      const SourceA = createTestSourceClass({
        id: 'source-a',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        fetchData: getDataA,
        onInit: ({ push }) => {
          pushA = push
        },
      })
      const SourceB = createTestSourceClass({
        id: 'source-b',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        fetchData: getDataB,
        onInit: ({ push }) => {
          pushB = push
        },
      })

      await feeds.addFeed(
        'composed',
        { a: await createDataSource(cache, vent, SourceA), b: await createDataSource(cache, vent, SourceB) },
        content => content,
      )

      const sourcesReady = Promise.all([waitForDataUpdate(vent, 'source-a'), waitForDataUpdate(vent, 'source-b')])
      pushA({ value: 10 })
      pushB({ value: 20 })
      await sourcesReady
      await waitForFeedIdle(vent, 'composed')

      getDataA.mockClear()
      getDataB.mockClear()

      const feedEvents: unknown[] = []
      vent.on('feed', (_id, value) => feedEvents.push(value))

      vent.emit('data-update', 'source-a')
      await waitForFeedIdle(vent, 'composed')

      expect(feedEvents).toHaveLength(1)
      expect(getDataA).not.toHaveBeenCalled()
      expect(getDataB).not.toHaveBeenCalled()
      expect(feedEvents[0]).toEqual({ a: { value: 10 }, b: { value: 20 } })
    })

    it('runs getData script on non-trigger sources that have no cache', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushWarm: (content: { value: number }) => void = () => {}
      const getDataCold = vi.fn(async () => ({ value: 99 }))
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
        fetchData: getDataCold,
      })

      await feeds.addFeed(
        'partial',
        {
          warm: await createDataSource(cache, vent, WarmSource),
          cold: await createDataSource(cache, vent, ColdSource),
        },
        content => content,
      )

      const feedEvents: unknown[] = []
      vent.on('feed', (_id, value) => feedEvents.push(value))

      const warmReady = waitForDataUpdate(vent, 'warm')
      pushWarm({ value: 1 })
      await warmReady
      await waitForFeedIdle(vent, 'partial')

      expect(getDataCold).toHaveBeenCalledOnce()
      expect(feedEvents.at(-1)).toEqual({ warm: { value: 1 }, cold: { value: 99 } })
    })

    it('fetches sibling content via ensureContent when sibling has no cache', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushB: (content: { value: number }) => void = () => {}
      const getDataA = vi.fn(async () => ({ value: 10 }))
      const getDataB = vi.fn(async () => ({ value: 20 }))
      const SourceA = createTestSourceClass({
        id: 'source-a',
        isVolatile: true,
        fetchData: getDataA,
      })
      const SourceB = createTestSourceClass({
        id: 'source-b',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        fetchData: getDataB,
        onInit: ({ push }) => {
          pushB = push
        },
      })

      await feeds.addFeed(
        'composed',
        { a: await createDataSource(cache, vent, SourceA), b: await createDataSource(cache, vent, SourceB) },
        content => content,
      )

      const feedEvents: unknown[] = []
      vent.on('feed', (_id, value) => feedEvents.push(value))

      const sourceBReady = waitForDataUpdate(vent, 'source-b')
      pushB({ value: 20 })
      await sourceBReady
      await waitForFeedIdle(vent, 'composed')

      expect(getDataA).toHaveBeenCalledOnce()
      expect(getDataB).toHaveBeenCalledTimes(0)
      expect(feedEvents.at(-1)).toEqual({ a: { value: 10 }, b: { value: 20 } })
    })

    it('composes feed when trigger source emits data-update without writing new cache content', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushTrigger: (content?: { value: number }) => void = () => {}
      const getDataTrigger = vi.fn(async () => ({ value: 100 }))
      const getDataSibling = vi.fn(async () => ({ value: 200 }))
      const TriggerSource = createTestSourceClass({
        id: 'job-ads',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        fetchData: getDataTrigger,
        onInit: ({ push }) => {
          pushTrigger = push
        },
      })
      const SiblingSource = createTestSourceClass({
        id: 'my-skills',
        isVolatile: true,
        fetchData: getDataSibling,
      })

      await feeds.addFeed(
        'job-ads-feed',
        {
          jobAds: await createDataSource(cache, vent, TriggerSource),
          mySkills: await createDataSource(cache, vent, SiblingSource),
        },
        content => content,
      )

      const warmReady = waitForDataUpdate(vent, 'job-ads')
      pushTrigger({ value: 42 })
      await warmReady
      await waitForFeedIdle(vent, 'job-ads-feed')

      getDataTrigger.mockClear()
      getDataSibling.mockClear()

      const feedEvents: unknown[] = []
      vent.on('feed', (_id, value) => feedEvents.push(value))

      const updateReady = waitForDataUpdate(vent, 'job-ads')
      pushTrigger()
      await updateReady
      await waitForFeedIdle(vent, 'job-ads-feed')

      expect(feedEvents).toHaveLength(1)
      expect(getDataTrigger).not.toHaveBeenCalled()
      expect(getDataSibling).not.toHaveBeenCalled()
      expect(feedEvents[0]).toEqual({ jobAds: { value: 42 }, mySkills: { value: 200 } })
    })

    it('skips feed when trigger source has no recent content', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      const TriggerSource = createTestSourceClass({
        id: 'empty-trigger',
        isVolatile: true,
      })
      const SiblingSource = createTestSourceClass({
        id: 'sibling',
        isVolatile: true,
        fetchData: vi.fn(async () => ({ value: 99 })),
      })

      await feeds.addFeed(
        'skip-on-null',
        {
          trigger: await createDataSource(cache, vent, TriggerSource),
          sibling: await createDataSource(cache, vent, SiblingSource),
        },
        content => content,
      )

      const feedEvents: unknown[] = []
      vent.on('feed', (_id, value) => feedEvents.push(value))

      vent.emit('data-update', 'empty-trigger')
      await waitForFeedIdle(vent, 'skip-on-null')

      expect(feedEvents).toHaveLength(0)
    })

    it('does not skip feed when only a non-trigger source lacks recent content', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushTrigger: (content: { value: number }) => void = () => {}
      const getDataSibling = vi.fn(async () => ({ value: 77 }))
      const TriggerSource = createTestSourceClass({
        id: 'trigger',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        onInit: ({ push }) => {
          pushTrigger = push
        },
      })
      const SiblingSource = createTestSourceClass({
        id: 'no-cache-sibling',
        isVolatile: true,
        fetchData: getDataSibling,
      })

      await feeds.addFeed(
        'mixed',
        {
          trigger: await createDataSource(cache, vent, TriggerSource),
          sibling: await createDataSource(cache, vent, SiblingSource),
        },
        content => content,
      )

      const feedEvents: unknown[] = []
      vent.on('feed', (_id, value) => feedEvents.push(value))

      const warmReady = waitForDataUpdate(vent, 'trigger')
      pushTrigger({ value: 5 })
      await warmReady
      await waitForFeedIdle(vent, 'mixed')

      expect(getDataSibling).toHaveBeenCalledOnce()
      expect(feedEvents.at(-1)).toEqual({ trigger: { value: 5 }, sibling: { value: 77 } })
    })

    it('does not cascade data-update when sibling is fetched during feed composition', async () => {
      const { vent, feeds, cache } = createCompositionFeeds()

      let pushWarm: (content: { value: number }) => void = () => {}
      const getDataCold = vi.fn(async () => ({ value: 99 }))
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
        fetchData: getDataCold,
      })

      await feeds.addFeed(
        'no-cascade',
        {
          warm: await createDataSource(cache, vent, WarmSource),
          cold: await createDataSource(cache, vent, ColdSource),
        },
        content => content,
      )

      const dataUpdates: string[] = []
      const feedEvents: unknown[] = []
      vent.on('data-update', sourceId => dataUpdates.push(sourceId))
      vent.on('feed', (_id, value) => feedEvents.push(value))

      const warmReady = waitForDataUpdate(vent, 'warm')
      pushWarm({ value: 1 })
      await warmReady
      await waitForFeedIdle(vent, 'no-cascade')

      expect(getDataCold).toHaveBeenCalledOnce()
      expect(dataUpdates).toEqual(['warm'])
      expect(feedEvents).toHaveLength(1)
      expect(feedEvents[0]).toEqual({ warm: { value: 1 }, cold: { value: 99 } })
    })
  })

  it('refresh forces script on all sources', async () => {
    const vent = new FeedEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'feeds-'))
    cacheDirs.push(cacheDir)
    const cache = new FSCache(cacheDir)
    const feeds = new FeedComposer(vent, {
      logger: createSilentLogger(),
      onError: noopOnError,
    })

    const getDataA = vi.fn(async () => ({ value: 1 }))
    const getDataB = vi.fn(async () => ({ value: 2 }))

    await feeds.addFeed(
      'refresh-a-feed',
      { a: await createDataSource(cache, vent, createTestSourceClass({ id: 'refresh-a', fetchData: getDataA })) },
      content => content,
    )
    await feeds.addFeed(
      'refresh-b-feed',
      { b: await createDataSource(cache, vent, createTestSourceClass({ id: 'refresh-b', fetchData: getDataB })) },
      content => content,
    )

    const refreshDone = Promise.all([waitForDataUpdate(vent, 'refresh-a'), waitForDataUpdate(vent, 'refresh-b')])
    vent.emit('feeds-refresh', ['refresh-a-feed', 'refresh-b-feed'])
    await refreshDone

    expect(getDataA).toHaveBeenCalledTimes(1)
    expect(getDataB).toHaveBeenCalledTimes(1)
  })
})
