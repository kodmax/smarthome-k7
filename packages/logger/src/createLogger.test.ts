import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@repo/env', () => ({
  isProduction: true,
}))

import { createLogger, readScopedLogLevel } from './index'

const env = process.env

afterEach(() => {
  process.env = { ...env }
})

describe('createLogger', () => {
  it('applies LOG_LEVEL_<COMPONENT> when passed explicitly to child()', () => {
    delete process.env.LOG_LEVEL
    process.env.LOG_LEVEL_FEEDS = 'debug'

    const messages: string[] = []
    const logger = createLogger({
      name: 'service',
      destination: {
        write(chunk: string) {
          messages.push(JSON.parse(chunk).msg as string)
        },
      },
    })

    const feeds = logger.child({ component: 'feeds' }, { level: readScopedLogLevel('feeds') })
    const ws = logger.child({ component: 'ws' }, { level: readScopedLogLevel('ws') })

    feeds.debug('feeds debug')
    ws.debug('ws debug')
    feeds.info('feeds info')
    ws.info('ws info')

    expect(messages).toEqual(['feeds debug', 'feeds info', 'ws info'])
  })
})
