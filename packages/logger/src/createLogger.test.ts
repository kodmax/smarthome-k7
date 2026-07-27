import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@repo/env', () => ({
  isProduction: true,
}))

import { createLogger } from './createLogger'

const env = process.env

afterEach(() => {
  process.env = { ...env }
})

describe('createLogger component levels', () => {
  it('applies LOG_LEVEL_<COMPONENT> only to matching child loggers', () => {
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

    const feeds = logger.child({ component: 'feeds' })
    const ws = logger.child({ component: 'ws' })

    feeds.debug('feeds debug')
    ws.debug('ws debug')
    feeds.info('feeds info')
    ws.info('ws info')

    expect(messages).toEqual(['feeds debug', 'feeds info', 'ws info'])
  })
})
