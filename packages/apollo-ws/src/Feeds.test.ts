import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApolloEvents } from './ApolloEvents'
import type { ApolloEvents as ApolloEventsType } from './ApolloEvents'
import { FSCache } from './cache'
import { DuplicateDataSourceIdError } from './Errors'
import { Feeds } from './Feeds'
import { DataSourceDefinition, DataSourceDefinitionClass } from './DataSource'
import { noopErrorHandler } from './notifyError'

function waitForDataUpdate(vent: ApolloEventsType, sourceId: string): Promise<void> {
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

async function waitForFeedIdle(vent: ApolloEventsType, feedId: string): Promise<void> {
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
  getData?: () => Promise<T>
  isVolatile?: boolean
  onInit?: (ctx: { push: (content?: T) => void }) => void
  handleCommand?: (command: string, args: string, recentContent?: T) => void | Promise<void>
  maintenance?: () => void | Promise<void>
}): DataSourceDefinitionClass<T> {
  return class TestSource extends DataSourceDefinition<T> {
    public constructor(push: (content?: T) => void, reportError: (e: Error) => void) {
      super(push, reportError)
      options.onInit?.({ push: content => this.push(content) })
    }

    public async handleCommand(command: string, args: string, recentContent?: T): Promise<void> {
      await options.handleCommand?.(command, args, recentContent)
    }

    public getId(): string {
      return options.id
    }

    public getCacheTTL(): number {
      return options.getCacheTTL?.() ?? 0
    }

    public async getData(): Promise<T> {
      return options.getData !== undefined ? await options.getData() : ({ value: 1 } as T)
    }

    public isVolatile(): boolean {
      return options.isVolatile ?? false
    }

    public async maintenance(): Promise<void> {
      await options.maintenance?.()
    }
  }
}

describe('Feeds data source registration', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createFeeds(onError = noopErrorHandler) {
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)

    return new Feeds(new FSCache(cacheDir), new ApolloEvents(), { onError })
  }

  it('reuses the same DataSource when the same definition class is registered in multiple feeds', async () => {
    const feeds = createFeeds()
    const SourceClass = createTestSourceClass({ id: 'shared-source' })

    await feeds.addFeed('feed-a', { src: SourceClass })
    await feeds.addFeed('feed-b', { src: SourceClass })

    await expect(feeds.addFeed('feed-c', { src: SourceClass })).resolves.toBeUndefined()
  })

  it('throws when a different definition class reuses an existing data source id', async () => {
    const feeds = createFeeds()
    const FirstSource = createTestSourceClass({ id: 'duplicate-id' })
    const SecondSource = createTestSourceClass({ id: 'duplicate-id' })

    await feeds.addFeed('feed-a', { src: FirstSource })

    await expect(feeds.addFeed('feed-b', { src: SecondSource })).rejects.toThrow(DuplicateDataSourceIdError)
  })

  it('allows different ids for different definition classes', async () => {
    const feeds = createFeeds()

    await feeds.addFeed('feed-a', { src: createTestSourceClass({ id: 'source-a' }) })
    await feeds.addFeed('feed-b', { src: createTestSourceClass({ id: 'source-b' }) })
  })

  it('routes commands through vent to the push source handler', async () => {
    const commandHandler = vi.fn()
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new FSCache(cacheDir), vent, { onError: noopErrorHandler })

    const SourceClass = createTestSourceClass({
      id: 'routed-src',
      isVolatile: true,
      handleCommand: (command, args) => {
        if (command === 'setLevel') {
          commandHandler(args)
        }
      },
    })

    await feeds.addFeed('routed', { src: SourceClass })

    vent.emit('command', { sourceId: 'routed-src', name: 'setLevel', args: '50' })
    vent.emit('command', { sourceId: 'other-src', name: 'setLevel', args: '99' })

    await vi.waitFor(() => expect(commandHandler).toHaveBeenCalledTimes(1))
    expect(commandHandler).toHaveBeenCalledWith('50')
  })

  it('calls onError when command execution fails', async () => {
    const onError = vi.fn()
    const failure = new Error('command failed')
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new FSCache(cacheDir), vent, { onError })

    await feeds.addFeed('cmd-feed', {
      src: createTestSourceClass({
        id: 'cmd-src',
        handleCommand: async () => {
          throw failure
        },
      }),
    })

    vent.emit('command', { sourceId: 'cmd-src', name: 'fail', args: '' })

    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    expect(onError).toHaveBeenCalledWith(failure, 'Data source <cmd-src> command <fail> execution error')
  })

  it('runs maintenance sequentially for all registered data sources at 3 AM', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T02:59:55.000'))

    try {
      const order: string[] = []
      const feeds = createFeeds()

      await feeds.addFeed('feed-a', {
        src: createTestSourceClass({
          id: 'maint-a',
          maintenance: async () => {
            order.push('maint-a-start')
            await new Promise(resolve => setTimeout(resolve, 20))
            order.push('maint-a-end')
          },
        }),
      })
      await feeds.addFeed('feed-b', {
        src: createTestSourceClass({
          id: 'maint-b',
          maintenance: () => {
            order.push('maint-b')
          },
        }),
      })

      await vi.advanceTimersByTimeAsync(10_000)
      await vi.advanceTimersByTimeAsync(50)

      expect(order).toEqual(['maint-a-start', 'maint-a-end', 'maint-b'])

      feeds.close()
    } finally {
      vi.useRealTimers()
    }
  })
})

const FRESH_CACHE_TTL_MS = 3_600_000

describe('Feeds composition', () => {
  const cacheDirs: string[] = []
  const activeFeeds: Feeds[] = []

  afterEach(() => {
    for (const feeds of activeFeeds.splice(0)) {
      feeds.close()
    }
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createCompositionFeeds() {
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)

    const feeds = new Feeds(new FSCache(cacheDir), vent, { onError: noopErrorHandler })
    activeFeeds.push(feeds)

    return { vent, feeds }
  }

  describe('data-update source selection (triggeredBy)', () => {
    it('reads the trigger source from cache via getRecentContent without re-running getData script', async () => {
      const { vent, feeds } = createCompositionFeeds()

      let pushA: (content: { value: number }) => void = () => {}
      let pushB: (content: { value: number }) => void = () => {}
      const getDataA = vi.fn(async () => ({ value: 10 }))
      const getDataB = vi.fn(async () => ({ value: 20 }))
      const SourceA = createTestSourceClass({
        id: 'source-a',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        getData: getDataA,
        onInit: ({ push }) => {
          pushA = push
        },
      })
      const SourceB = createTestSourceClass({
        id: 'source-b',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        getData: getDataB,
        onInit: ({ push }) => {
          pushB = push
        },
      })

      await feeds.addFeed('composed', { a: SourceA, b: SourceB }, content => content)

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
      const { vent, feeds } = createCompositionFeeds()

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
        getData: getDataCold,
      })

      await feeds.addFeed('partial', { warm: WarmSource, cold: ColdSource }, content => content)

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
      const { vent, feeds } = createCompositionFeeds()

      let pushB: (content: { value: number }) => void = () => {}
      const getDataA = vi.fn(async () => ({ value: 10 }))
      const getDataB = vi.fn(async () => ({ value: 20 }))
      const SourceA = createTestSourceClass({
        id: 'source-a',
        isVolatile: true,
        getData: getDataA,
      })
      const SourceB = createTestSourceClass({
        id: 'source-b',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        getData: getDataB,
        onInit: ({ push }) => {
          pushB = push
        },
      })

      await feeds.addFeed('composed', { a: SourceA, b: SourceB }, content => content)

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
      const { vent, feeds } = createCompositionFeeds()

      let pushTrigger: (content?: { value: number }) => void = () => {}
      const getDataTrigger = vi.fn(async () => ({ value: 100 }))
      const getDataSibling = vi.fn(async () => ({ value: 200 }))
      const TriggerSource = createTestSourceClass({
        id: 'job-ads',
        isVolatile: true,
        getCacheTTL: () => FRESH_CACHE_TTL_MS,
        getData: getDataTrigger,
        onInit: ({ push }) => {
          pushTrigger = push
        },
      })
      const SiblingSource = createTestSourceClass({
        id: 'my-skills',
        isVolatile: true,
        getData: getDataSibling,
      })

      await feeds.addFeed('job-ads-feed', { jobAds: TriggerSource, mySkills: SiblingSource }, content => content)

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

    it('does not skip feed when only a non-trigger source lacks recent content', async () => {
      const { vent, feeds } = createCompositionFeeds()

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
        getData: getDataSibling,
      })

      await feeds.addFeed('mixed', { trigger: TriggerSource, sibling: SiblingSource }, content => content)

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
      const { vent, feeds } = createCompositionFeeds()

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
        getData: getDataCold,
      })

      await feeds.addFeed('no-cascade', { warm: WarmSource, cold: ColdSource }, content => content)

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
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new FSCache(cacheDir), vent, { onError: noopErrorHandler })
    activeFeeds.push(feeds)

    const getDataA = vi.fn(async () => ({ value: 1 }))
    const getDataB = vi.fn(async () => ({ value: 2 }))

    await feeds.addFeed('refresh-a-feed', {
      a: createTestSourceClass({ id: 'refresh-a', getData: getDataA }),
    })
    await feeds.addFeed('refresh-b-feed', {
      b: createTestSourceClass({ id: 'refresh-b', getData: getDataB }),
    })

    const refreshDone = Promise.all([waitForDataUpdate(vent, 'refresh-a'), waitForDataUpdate(vent, 'refresh-b')])
    vent.emit('feeds-refresh', ['refresh-a-feed', 'refresh-b-feed'])
    await refreshDone

    expect(getDataA).toHaveBeenCalledTimes(1)
    expect(getDataB).toHaveBeenCalledTimes(1)
  })
})
