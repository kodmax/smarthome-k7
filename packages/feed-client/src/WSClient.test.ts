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
  let readyState = 1

  beforeEach(() => {
    sent.length = 0
    openHandler = undefined
    messageHandler = undefined
    closeHandler = undefined
    readyState = 1

    const WebSocketMock = vi.fn(function WebSocketMock() {
      return {
        get readyState() {
          return readyState
        },
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
    }) as unknown as typeof WebSocket

    Object.assign(WebSocketMock, {
      OPEN: 1,
      CONNECTING: 0,
      CLOSED: 3,
    })

    vi.stubGlobal('WebSocket', WebSocketMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends a full subscription snapshot in the same microtask', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    client.subscribe('energy')

    await flushMicrotasks()

    expect(sent).toEqual(['subscribe weather energy'])
  })

  it('sends a full snapshot after local unsubscribes', async () => {
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

    expect(sent).toEqual(['subscribe'])
  })

  it('resubscribes the remaining topics after reconnect', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    client.subscribe('energy')
    await flushMicrotasks()
    sent.length = 0

    client.unsubscribe('weather')
    await flushMicrotasks()
    sent.length = 0

    closeHandler?.()
    openHandler?.()

    expect(sent).toEqual(['subscribe energy'])
  })

  it('keeps a topic subscribed when unsubscribe and subscribe happen in the same batch', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('weather')
    await flushMicrotasks()
    sent.length = 0

    client.unsubscribe('weather')
    client.subscribe('weather')

    await flushMicrotasks()

    expect(sent).toEqual(['subscribe weather'])
  })

  it('syncs job-ads after a navigation-style handoff in one batch', async () => {
    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('job-market-insight')
    client.subscribe('my-skills')
    client.subscribe('cv')
    client.subscribe('job-ads')
    await flushMicrotasks()
    sent.length = 0

    client.unsubscribe('my-skills')
    client.unsubscribe('job-market-insight')
    client.unsubscribe('cv')
    client.subscribe('energy')
    client.subscribe('weather')

    await flushMicrotasks()

    expect(sent).toEqual(['subscribe job-ads energy weather'])
  })

  it('forwards FEED-UPDATE messages to onFeedChanged', () => {
    const onFeedChanged = vi.fn()
    const client = new WSClient('ws://test', onFeedChanged)
    client.subscribe('weather')

    messageHandler?.({ data: 'FEED-UPDATE weather' } as MessageEvent<string>)

    expect(onFeedChanged).toHaveBeenCalledWith('weather')
  })

  it('sends subscribe after open when topics were added while connecting', async () => {
    readyState = 0

    const client = new WSClient('ws://test', vi.fn())
    client.subscribe('job-market-insight')
    client.subscribe('cv')
    readyState = 1
    openHandler?.()

    expect(sent).toEqual(['subscribe job-market-insight cv'])

    sent.length = 0
    client.subscribe('job-ads')

    await flushMicrotasks()

    expect(sent).toEqual(['subscribe job-market-insight cv job-ads'])
  })
})
