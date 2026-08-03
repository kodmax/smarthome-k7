import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeedEvents } from '../FeedManager'
import { FSCache } from '../Cache'
import { DataSource } from './DataSource'
import { DataSourceRegistry } from './DataSourceRegistry'
import { createSilentLogger } from '@repo/logger'
import { DataSourceCtor } from './types'

const noopOnError = (): void => void 0

function createTestSourceClass(options: {
  id: string
  maintenance?: () => void | Promise<void>
}): DataSourceCtor<{ value: number }> {
  class TestSource extends DataSource<{ value: number }> {
    public static getId(): string {
      return options.id
    }

    public static getCacheTTL(): number {
      return 0
    }

    protected async fetchData(): Promise<{ value: number }> {
      return { value: 1 }
    }

    public async maintenance(): Promise<void> {
      await options.maintenance?.()
    }
  }

  return TestSource
}

describe('DataSourceRegistry', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    vi.useRealTimers()
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createRegistry() {
    const cacheDir = mkdtempSync(join(tmpdir(), 'registry-'))
    cacheDirs.push(cacheDir)

    return new DataSourceRegistry<{
      sourceA: ReturnType<typeof createTestSourceClass>
      sourceB: ReturnType<typeof createTestSourceClass>
    }>({
      cache: new FSCache(cacheDir),
      feedEvents: new FeedEvents(),
      logger: createSilentLogger(),
      onError: noopOnError,
      observeDataSourceRefresh: async (_metricType, _sourceId, fn) => fn(),
    })
  }

  it('runs maintenance sequentially for all registered data sources at 3 AM', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T02:59:55.000'))

    try {
      const order: string[] = []
      const registry = createRegistry()

      await registry.add(
        'sourceA',
        createTestSourceClass({
          id: 'maint-a',
          maintenance: async () => {
            order.push('maint-a-start')
            await new Promise(resolve => setTimeout(resolve, 20))
            order.push('maint-a-end')
          },
        }),
      )
      await registry.add(
        'sourceB',
        createTestSourceClass({
          id: 'maint-b',
          maintenance: () => {
            order.push('maint-b')
          },
        }),
      )

      await vi.advanceTimersByTimeAsync(10_000)
      await vi.advanceTimersByTimeAsync(50)

      expect(order).toEqual(['maint-a-start', 'maint-a-end', 'maint-b'])

      registry.close()
    } finally {
      vi.useRealTimers()
    }
  })
})
