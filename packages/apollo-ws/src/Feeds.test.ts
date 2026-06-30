import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { ApolloEvents } from './ApolloEvents'
import { afterEach, describe, expect, it } from 'vitest'
import { Cache } from './cache'
import { DuplicateDataSourceIdError } from './Errors'
import { Feeds } from './Feeds'
import type { DataSourceDefinition } from './DataSource'

function makeDefinition(id: string): DataSourceDefinition<{ value: number }> {
  return {
    id,
    expired: () => true,
    script: async () => ({ value: 1 }),
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
    const definition = makeDefinition('shared-source')

    await feeds.addFeed('feed-a', { src: definition })
    await feeds.addFeed('feed-b', { src: definition })

    await expect(feeds.addFeed('feed-c', { src: definition })).resolves.toBeUndefined()
  })

  it('throws when a different definition object reuses an existing data source id', async () => {
    const feeds = createFeeds()
    const first = makeDefinition('duplicate-id')
    const second = makeDefinition('duplicate-id')

    await feeds.addFeed('feed-a', { src: first })

    await expect(feeds.addFeed('feed-b', { src: second })).rejects.toThrow(DuplicateDataSourceIdError)
  })

  it('allows different ids for different definition objects', async () => {
    const feeds = createFeeds()

    await feeds.addFeed('feed-a', { src: makeDefinition('source-a') })
    await feeds.addFeed('feed-b', { src: makeDefinition('source-b') })
  })
})
