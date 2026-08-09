import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@repo/env', () => ({
  isProduction: true,
}))

import { childComponentLogger, createLogger, readScopedLogLevel } from './index'

const env = process.env

afterEach(() => {
  process.env = { ...env }
})

describe('childComponentLogger', () => {
  it('applies LOG_LEVEL_<COMPONENT> via child bindings', () => {
    delete process.env.LOG_LEVEL
    process.env.LOG_LEVEL_FEEDS = 'debug'

    const messages: string[] = []
    const root = createLogger({
      name: 'service',
      destination: {
        write(chunk: string) {
          messages.push(JSON.parse(chunk).msg as string)
        },
      },
    })

    const feeds = childComponentLogger(root, 'feeds')
    const ws = childComponentLogger(root, 'ws')

    feeds.debug('feeds debug')
    ws.debug('ws debug')
    feeds.info('feeds info')
    ws.info('ws info')

    expect(messages).toEqual(['feeds debug', 'feeds info', 'ws info'])
    expect(readScopedLogLevel('feeds')).toBe('debug')
  })
})
