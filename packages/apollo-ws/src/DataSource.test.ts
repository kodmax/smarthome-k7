import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApolloEvents } from './ApolloEvents'
import { Cache, Snapshot } from './cache'
import { DataSource, DataSourceDefinition, DataSourceDefinitionClass } from './DataSource'
import { NoRecentContent } from './Errors'

function createTestSourceClass<T>(options: {
  id: string
  isSnapshotExpired?: (snapshot: Snapshot<unknown>) => boolean
  getData?: () => Promise<T>
  isVolatile?: boolean
  handleCommand?: (command: string, args: string, recentContent?: T) => void | Promise<void>
}): DataSourceDefinitionClass<T> {
  return class TestSource extends DataSourceDefinition<T> {
    public async handleCommand(command: string, args: string, recentContent?: T): Promise<void> {
      await options.handleCommand?.(command, args, recentContent)
    }

    public getId(): string {
      return options.id
    }

    public isSnapshotExpired(snapshot: Snapshot<unknown>): boolean {
      return options.isSnapshotExpired?.(snapshot) ?? true
    }

    public async getData(): Promise<T> {
      return options.getData !== undefined ? await options.getData() : ({ value: 1 } as T)
    }

    public isVolatile(): boolean {
      return options.isVolatile ?? false
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

  async function createDataSource<T>(SourceClass: DataSourceDefinitionClass<T>) {
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
    expect(dataSource.getRecentContent()).toEqual({ value: 123 })
  })

  it('throws NoRecentContent when cache is empty', async () => {
    const { dataSource } = await createDataSource(createTestSourceClass({ id: 'empty' }))

    expect(() => dataSource.getRecentContent()).toThrow(NoRecentContent)
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
})
