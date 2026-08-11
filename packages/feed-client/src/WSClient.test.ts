import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WSClient } from './WSClient'

const flushMicrotasks = async (): Promise<void> => {
  await Promise.resolve()
}

describe('WSClient', () => {
  const sent: string[] = []
  let openHandler: (() => void) | undefined
  let messageHandler: ((ev: MessageEvent<string>) => void) | undefined
  let closeHandler: (() => void) | undefined

  beforeEach(() => {
    sent.length = 0
    openHandler = undefined
    messageHandler = undefined
    closeHandler = undefined

    vi.stubGlobal(
      'WebSocket',
      vi.fn(function WebSocketMock() {
        return {
          readyState: 1,
          OPEN: 1,
          send: (data: string) => {
            sent.push(data)
          },
          addEventListener: (event: string, handler: (...args: unknown[]) => void) => {
            if (event === 'open') {
              openHandler = handler as () => void
            }
            if (event === 'message') {
              messageHandler = handler as (ev: MessageEvent<string>) => void
            }
            if (event === 'close') {
              closeHandler = handler as () => void
            }
          },
        }
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('batches subscribe messages in the same microtask', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    client.subscribe('energy')

    await flushMicrotasks()

    expect(sent).toEqual(['subscribe weather energy'])
  })

  it('batches unsubscribe messages in the same microtask', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    client.subscribe('energy')
    client.subscribe('indoor')
    await flushMicrotasks()
    sent.length = 0

    client.unsubscribe('weather')
    client.unsubscribe('energy')
    client.unsubscribe('indoor')

    await flushMicrotasks()

    expect(sent).toEqual(['unsubscribe weather energy indoor'])
  })

  it('drops topic from reconnect set after unsubscribe', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    client.subscribe('energy')
    await flushMicrotasks()
    sent.length = 0

    client.unsubscribe('weather')
    await flushMicrotasks()

    closeHandler?.()
    openHandler?.()

    expect(sent).toEqual(['unsubscribe weather', 'subscribe energy'])
  })

  it('skips wire updates when subscribe and unsubscribe cancel out in the same batch', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    await flushMicrotasks()
    sent.length = 0

    client.unsubscribe('weather')
    client.subscribe('weather')

    await flushMicrotasks()

    expect(sent).toEqual([])
  })

  it('forwards FEED-UPDATE messages to onFeedChanged', () => {
    const onFeedChanged = vi.fn()
    new WSClient('ws://test', onFeedChanged)

    messageHandler?.({ data: 'FEED-UPDATE weather' } as MessageEvent<string>)

    expect(onFeedChanged).toHaveBeenCalledWith('weather')
  })
})
