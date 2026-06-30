import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApolloEvents } from './ApolloEvents'
import { Cache } from './cache'
import { DataSource, type DataSourceDefinition } from './DataSource'
import { NoRecentContent } from './Errors'

function makeDefinition<T>(
  overrides: Partial<DataSourceDefinition<T>> & Pick<DataSourceDefinition<T>, 'id'>,
): DataSourceDefinition<T> {
  return {
    expired: () => true,
    script: async () => ({ value: 1 }) as T,
    ...overrides,
  }
}

describe('DataSource', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  async function createDataSource<T>(definition: DataSourceDefinition<T>) {
    const cacheDir = mkdtempSync(join(tmpdir(), 'apollo-ws-ds-'))
    cacheDirs.push(cacheDir)

    const vent = new ApolloEvents()
    const cache = new Cache(cacheDir)
    const entry = await cache.getEntry<T>(definition.volatile === true ? undefined : definition.id)

    return {
      dataSource: new DataSource(definition, entry, vent),
      vent,
    }
  }

  it('returns cached content on cache hit without calling script', async () => {
    const script = vi.fn(async () => ({ value: 99 }))
    const { dataSource } = await createDataSource(
      makeDefinition({
        id: 'cache-hit',
        expired: () => false,
        script,
      }),
    )

    await dataSource.getData()
    script.mockClear()

    await expect(dataSource.getData()).resolves.toEqual({ value: 99 })
    expect(script).not.toHaveBeenCalled()
  })

  it('calls script on cache miss and on force refresh', async () => {
    const script = vi.fn(async () => ({ value: 42 }))
    const { dataSource } = await createDataSource(
      makeDefinition({
        id: 'cache-miss',
        script,
      }),
    )

    await expect(dataSource.getData()).resolves.toEqual({ value: 42 })
    expect(script).toHaveBeenCalledTimes(1)

    script.mockClear()
    await dataSource.getData()
    expect(script).toHaveBeenCalledTimes(1)

    script.mockClear()
    await expect(dataSource.getData(true)).resolves.toEqual({ value: 42 })
    expect(script).toHaveBeenCalledTimes(1)
  })

  it('deduplicates concurrent getData() calls', async () => {
    vi.useFakeTimers()

    const script = vi.fn(
      () =>
        new Promise<{ value: number }>(resolve => {
          setTimeout(() => resolve({ value: 7 }), 50)
        }),
    )
    const { dataSource } = await createDataSource(
      makeDefinition({
        id: 'dedup',
        script,
      }),
    )

    const first = dataSource.getData()
    const second = dataSource.getData()

    expect(script).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    await expect(first).resolves.toEqual({ value: 7 })
    await expect(second).resolves.toEqual({ value: 7 })

    vi.useRealTimers()
  })

  it('emits data-update after push', async () => {
    const updates: string[] = []
    const { dataSource, vent } = await createDataSource(
      makeDefinition({
        id: 'push-src',
        volatile: true,
      }),
    )

    vent.on('data-update', sourceId => updates.push(sourceId))

    await dataSource.push({ value: 123 })

    expect(updates).toEqual(['push-src'])
    expect(dataSource.getRecentContent()).toEqual({ value: 123 })
  })

  it('throws NoRecentContent when cache is empty', async () => {
    const { dataSource } = await createDataSource(makeDefinition({ id: 'empty' }))

    expect(() => dataSource.getRecentContent()).toThrow(NoRecentContent)
  })

  it('routes commands through vent to the push source handler', async () => {
    const commandHandler = vi.fn()
    const { vent } = await createDataSource(
      makeDefinition({
        id: 'routed-src',
        volatile: true,
        push: (_push, command) => {
          command.on('setLevel', args => commandHandler(args))
        },
      }),
    )

    vent.emit('command', { sourceId: 'routed-src', name: 'setLevel', args: '50' })
    vent.emit('command', { sourceId: 'other-src', name: 'setLevel', args: '99' })

    expect(commandHandler).toHaveBeenCalledTimes(1)
    expect(commandHandler).toHaveBeenCalledWith('50')
  })
})
