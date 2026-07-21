import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApolloEvents } from './ApolloEvents'
import type { ApolloEvents as ApolloEventsType } from './ApolloEvents'
import { Cache } from './cache'
import { DuplicateDataSourceIdError } from './Errors'
import { Feeds } from './Feeds'
import { DataSourceDefinition, DataSourceDefinitionClass } from './DataSource'

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

  function createFeeds() {
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)

    return new Feeds(new Cache(cacheDir), new ApolloEvents())
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
    const feeds = new Feeds(new Cache(cacheDir), vent)

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

describe('Feeds composition', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('uses getRecentContent on data-update (triggeredBy) without calling script again', async () => {
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new Cache(cacheDir), vent)

    let pushA: (content: { value: number }) => void = () => {}
    let pushB: (content: { value: number }) => void = () => {}
    const getDataA = vi.fn(async () => ({ value: 10 }))
    const SourceA = createTestSourceClass({
      id: 'source-a',
      isVolatile: true,
      getData: getDataA,
      onInit: ({ push }) => {
        pushA = push
      },
    })
    const SourceB = createTestSourceClass({
      id: 'source-b',
      isVolatile: true,
      onInit: ({ push }) => {
        pushB = push
      },
    })

    await feeds.addFeed('composed', { a: SourceA, b: SourceB }, content => content)

    const sourcesReady = Promise.all([waitForDataUpdate(vent, 'source-a'), waitForDataUpdate(vent, 'source-b')])
    pushA({ value: 10 })
    pushB({ value: 20 })
    await sourcesReady
    await new Promise(resolve => setTimeout(resolve, 50))

    getDataA.mockClear()

    const feedEvents: unknown[] = []
    vent.on('feed', (_id, value) => feedEvents.push(value))

    vent.emit('data-update', 'source-a')

    await vi.waitFor(() => expect(feedEvents).toHaveLength(1))
    expect(getDataA).not.toHaveBeenCalled()
    expect(feedEvents[0]).toEqual({ a: { value: 10 }, b: { value: 20 } })
  })

  it('swallows NoRecentContent when a source has no cache on data-update', async () => {
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new Cache(cacheDir), vent)

    let pushWarm: (content: { value: number }) => void = () => {}
    const WarmSource = createTestSourceClass({
      id: 'warm',
      isVolatile: true,
      onInit: ({ push }) => {
        pushWarm = push
      },
    })
    const ColdSource = createTestSourceClass({
      id: 'cold',
      isVolatile: true,
    })

    await feeds.addFeed('partial', { warm: WarmSource, cold: ColdSource }, content => content)

    const warmReady = waitForDataUpdate(vent, 'warm')
    pushWarm({ value: 1 })
    await warmReady

    const feedEvents: unknown[] = []
    vent.on('feed', (_id, value) => feedEvents.push(value))

    vent.emit('data-update', 'warm')

    await new Promise(resolve => setTimeout(resolve, 50))
    expect(feedEvents).toHaveLength(0)
  })

  it('refresh forces script on all sources', async () => {
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new Cache(cacheDir), vent)

    const getDataA = vi.fn(async () => ({ value: 1 }))
    const getDataB = vi.fn(async () => ({ value: 2 }))

    await feeds.addFeed(
      'refreshable',
      {
        a: createTestSourceClass({ id: 'refresh-a', getData: getDataA }),
        b: createTestSourceClass({ id: 'refresh-b', getData: getDataB }),
      },
      content => content,
    )

    const feedEvents: string[] = []
    vent.on('feed', feedId => feedEvents.push(feedId))

    vent.emit('feeds-refresh', ['refreshable'])

    await vi.waitFor(() => expect(feedEvents).toContain('refreshable'))
    expect(getDataA).toHaveBeenCalledTimes(1)
    expect(getDataB).toHaveBeenCalledTimes(1)
  })
})
