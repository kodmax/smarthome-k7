import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApolloEvents } from './ApolloEvents'
import { Cache, Snapshot } from './cache'
import { DataSource, DataSourceDefinition, DataSourceDefinitionClass } from './DataSource'
import { NoRecentContent } from './Errors'

function createTestSourceClass<T, TCache = T>(options: {
  id: string
  isSnapshotExpired?: (snapshot: Snapshot<unknown>) => boolean
  getData?: () => Promise<TCache>
  composeContent?: (cached: TCache) => Promise<T>
  isVolatile?: boolean
  handleCommand?: (command: string, args: string, recentContent?: T) => void | Promise<void>
  maintenance?: () => void | Promise<void>
}): DataSourceDefinitionClass<T, TCache> {
  return class TestSource extends DataSourceDefinition<T, TCache> {
    public async handleCommand(command: string, args: string, recentContent?: T): Promise<void> {
      await options.handleCommand?.(command, args, recentContent)
    }

    public getId(): string {
      return options.id
    }

    public isSnapshotExpired(snapshot: Snapshot<unknown>): boolean {
      return options.isSnapshotExpired?.(snapshot) ?? true
    }

    public async getData(): Promise<TCache> {
      return options.getData !== undefined ? await options.getData() : ({ value: 1 } as TCache)
    }

    public async composeContent(cached: TCache): Promise<T> {
      return options.composeContent !== undefined
        ? await options.composeContent(cached)
        : await super.composeContent(cached)
    }

    public isVolatile(): boolean {
      return options.isVolatile ?? false
    }

    public async maintenance(): Promise<void> {
      await options.maintenance?.()
    }
  }
}

describe('DataSource', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  async function createDataSource<T, TCache = T>(SourceClass: DataSourceDefinitionClass<T, TCache>) {
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-ds-'))
    cacheDirs.push(cacheDir)

    const vent = new ApolloEvents()
    const cache = new Cache(cacheDir)
    const dataSource = await DataSource.fromClass(SourceClass, cache, vent)

    return {
      dataSource,
      vent,
    }
  }

  it('returns cached content on cache hit without calling script', async () => {
    const getData = vi.fn(async () => ({ value: 99 }))
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'cache-hit',
        isSnapshotExpired: () => false,
        getData,
      }),
    )

    await dataSource.getData()
    getData.mockClear()

    await expect(dataSource.getData()).resolves.toEqual({ value: 99 })
    expect(getData).not.toHaveBeenCalled()
  })

  it('calls script on cache miss and on force refresh', async () => {
    const getData = vi.fn(async () => ({ value: 42 }))
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'cache-miss',
        getData,
      }),
    )

    await expect(dataSource.getData()).resolves.toEqual({ value: 42 })
    expect(getData).toHaveBeenCalledTimes(1)

    getData.mockClear()
    await dataSource.getData()
    expect(getData).toHaveBeenCalledTimes(1)

    getData.mockClear()
    await expect(dataSource.getData(true)).resolves.toEqual({ value: 42 })
    expect(getData).toHaveBeenCalledTimes(1)
  })

  it('deduplicates concurrent getData() calls', async () => {
    vi.useFakeTimers()

    const getData = vi.fn(
      () =>
        new Promise<{ value: number }>(resolve => {
          setTimeout(() => resolve({ value: 7 }), 50)
        }),
    )
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'dedup',
        getData,
      }),
    )

    const first = dataSource.getData()
    const second = dataSource.getData()

    expect(getData).toHaveBeenCalledTimes(1)

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

  it('throws NoRecentContent when cache is empty', async () => {
    const { dataSource } = await createDataSource(createTestSourceClass({ id: 'empty' }))

    await expect(dataSource.getRecentContent()).rejects.toThrow(NoRecentContent)
  })

  it('calls composeContent on cache hit without calling getData again', async () => {
    const getData = vi.fn(async () => ({ value: 5 }))
    const composeContent = vi.fn(async (cached: { value: number }) => ({ value: cached.value, meta: 'fresh' }))
    const { dataSource } = await createDataSource(
      createTestSourceClass<{ value: number; meta: string }, { value: number }>({
        id: 'compose-hit',
        isSnapshotExpired: () => false,
        getData,
        composeContent,
      }),
    )

    await dataSource.getData()
    getData.mockClear()
    composeContent.mockClear()

    await expect(dataSource.getData()).resolves.toEqual({ value: 5, meta: 'fresh' })
    expect(getData).not.toHaveBeenCalled()
    expect(composeContent).toHaveBeenCalledTimes(1)
    expect(composeContent).toHaveBeenCalledWith({ value: 5 })
  })

  it('emits data-update on push without content without changing cache', async () => {
    const updates: string[] = []
    let pushWithoutContent: () => void = () => {}

    class NotifySource extends DataSourceDefinition<{ value: number }> {
      public constructor(push: (content?: { value: number }) => void, reportError: (e: Error) => void) {
        super(push, reportError)
        pushWithoutContent = () => push()
      }

      public getId(): string {
        return 'notify-src'
      }

      public isSnapshotExpired(): boolean {
        return false
      }

      public async getData(): Promise<{ value: number }> {
        return { value: 1 }
      }
    }

    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-ds-'))
    cacheDirs.push(cacheDir)
    const vent = new ApolloEvents()
    const cache = new Cache(cacheDir)
    const dataSource = await DataSource.fromClass(NotifySource, cache, vent)

    vent.on('data-update', sourceId => updates.push(sourceId))
    await dataSource.getData()
    updates.length = 0

    pushWithoutContent()
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(updates).toEqual(['notify-src'])
    await expect(dataSource.getRecentContent()).resolves.toEqual({ value: 1 })
  })

  it('passes recent content to handleCommand when cache has data', async () => {
    const handleCommand = vi.fn()
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'cmd-src',
        isVolatile: true,
        handleCommand,
      }),
    )

    await dataSource.push({ value: 42 })
    await dataSource.handleCommand('set', '1')

    expect(handleCommand).toHaveBeenCalledWith('set', '1', { value: 42 })
  })

  it('passes undefined recent content to handleCommand when cache is empty', async () => {
    const handleCommand = vi.fn()
    const { dataSource } = await createDataSource(
      createTestSourceClass({
        id: 'cmd-empty',
        isVolatile: true,
        handleCommand,
      }),
    )

    await dataSource.handleCommand('set', '1')

    expect(handleCommand).toHaveBeenCalledWith('set', '1', undefined)
  })

  it('calls definition maintenance', async () => {
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
})
