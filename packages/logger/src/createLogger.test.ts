import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@repo/env', () => ({
  isProduction: true,
}))

const { isJournaldLoggingEnabled } = vi.hoisted(() => ({
  isJournaldLoggingEnabled: vi.fn(() => false),
}))

vi.mock('./isJournaldLoggingEnabled', () => ({
  isJournaldLoggingEnabled,
}))

import { createLogger, readScopedLogLevel } from './index'

const env = process.env

afterEach(() => {
  process.env = { ...env }
  isJournaldLoggingEnabled.mockReturnValue(false)
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

  it('prepends journald priority prefix when LOG_JOURNALD is enabled', () => {
    isJournaldLoggingEnabled.mockReturnValue(true)

    const lines: string[] = []
    const logger = createLogger({
      name: 'service',
      destination: {
        write(chunk: string) {
          lines.push(typeof chunk === 'string' ? chunk : chunk.toString())
        },
      },
    })

    logger.info('started')
    logger.error('failed')

    expect(lines).toHaveLength(2)

    const infoMatch = lines[0].match(/^<(\d+)>(.+)\n?$/)
    expect(infoMatch?.[1]).toBe('6')
    expect(JSON.parse(infoMatch![2]).msg).toBe('started')

    const errorMatch = lines[1].match(/^<(\d+)>(.+)\n?$/)
    expect(errorMatch?.[1]).toBe('3')
    expect(JSON.parse(errorMatch![2]).msg).toBe('failed')
  })
})
