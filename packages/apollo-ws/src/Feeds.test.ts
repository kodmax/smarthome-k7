import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApolloEvents } from './ApolloEvents'
import type { ApolloEvents as ApolloEventsType } from './ApolloEvents'
import { Cache } from './cache'
import { DuplicateDataSourceIdError } from './Errors'
import { Feeds } from './Feeds'
import type { DataSourceDefinition } from './DataSource'

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

function makeDefinition<T = { value: number }>(
  overrides: Partial<DataSourceDefinition<T>> & Pick<DataSourceDefinition<T>, 'id'>,
): DataSourceDefinition<T> {
  return {
    expired: () => true,
    script: async () => ({ value: 1 }) as T,
    ...overrides,
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

  it('reuses the same DataSource when the same definition object is registered in multiple feeds', async () => {
    const feeds = createFeeds()
    const definition = makeDefinition({ id: 'shared-source' })

    await feeds.addFeed('feed-a', { src: definition })
    await feeds.addFeed('feed-b', { src: definition })

    await expect(feeds.addFeed('feed-c', { src: definition })).resolves.toBeUndefined()
  })

  it('throws when a different definition object reuses an existing data source id', async () => {
    const feeds = createFeeds()
    const first = makeDefinition({ id: 'duplicate-id' })
    const second = makeDefinition({ id: 'duplicate-id' })

    await feeds.addFeed('feed-a', { src: first })

    await expect(feeds.addFeed('feed-b', { src: second })).rejects.toThrow(DuplicateDataSourceIdError)
  })

  it('allows different ids for different definition objects', async () => {
    const feeds = createFeeds()

    await feeds.addFeed('feed-a', { src: makeDefinition({ id: 'source-a' }) })
    await feeds.addFeed('feed-b', { src: makeDefinition({ id: 'source-b' }) })
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
    const scriptA = vi.fn(async () => ({ value: 10 }))
    const defA = makeDefinition({
      id: 'source-a',
      volatile: true,
      script: scriptA,
      push: pushFn => {
        pushA = pushFn
      },
    })
    const defB = makeDefinition({
      id: 'source-b',
      volatile: true,
      push: pushFn => {
        pushB = pushFn
      },
    })

    await feeds.addFeed('composed', { a: defA, b: defB }, content => content)

    const sourcesReady = Promise.all([waitForDataUpdate(vent, 'source-a'), waitForDataUpdate(vent, 'source-b')])
    pushA({ value: 10 })
    pushB({ value: 20 })
    await sourcesReady
    await new Promise(resolve => setTimeout(resolve, 50))

    scriptA.mockClear()

    const feedEvents: unknown[] = []
    vent.on('feed', (_id, value) => feedEvents.push(value))

    vent.emit('data-update', 'source-a')

    await vi.waitFor(() => expect(feedEvents).toHaveLength(1))
    expect(scriptA).not.toHaveBeenCalled()
    expect(feedEvents[0]).toEqual({ a: { value: 10 }, b: { value: 20 } })
  })

  it('swallows NoRecentContent when a source has no cache on data-update', async () => {
    const vent = new ApolloEvents()
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-feeds-'))
    cacheDirs.push(cacheDir)
    const feeds = new Feeds(new Cache(cacheDir), vent)

    let pushWarm: (content: { value: number }) => void = () => {}
    const warmDef = makeDefinition({
      id: 'warm',
      volatile: true,
      push: pushFn => {
        pushWarm = pushFn
      },
    })
    const coldDef = makeDefinition({
      id: 'cold',
      volatile: true,
      push: () => {},
    })

    await feeds.addFeed('partial', { warm: warmDef, cold: coldDef }, content => content)

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

    const scriptA = vi.fn(async () => ({ value: 1 }))
    const scriptB = vi.fn(async () => ({ value: 2 }))

    await feeds.addFeed(
      'refreshable',
      {
        a: makeDefinition({ id: 'refresh-a', script: scriptA }),
        b: makeDefinition({ id: 'refresh-b', script: scriptB }),
      },
      content => content,
    )

    const feedEvents: string[] = []
    vent.on('feed', feedId => feedEvents.push(feedId))

    vent.emit('feeds-refresh', ['refreshable'])

    await vi.waitFor(() => expect(feedEvents).toContain('refreshable'))
    expect(scriptA).toHaveBeenCalledTimes(1)
    expect(scriptB).toHaveBeenCalledTimes(1)
  })
})
