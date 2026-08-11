import { EventEmitter } from 'node:events'
import { Socket } from 'node:net'
import { createCaptureLogger } from '@repo/logger'
import { FeedEvents } from '@repo/feeds'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WebSocket } from 'ws'
import { AppLogger } from '../logger/app-logger.service'
import { FeedWebSocketService } from './feed-websocket.service'

const noopOnError = (): void => void 0

type MockWebSocket = WebSocket & EventEmitter & { sent: string[] }

function createMockWebSocket(): MockWebSocket {
  const emitter = new EventEmitter()
  const sent: string[] = []

  return Object.assign(emitter, {
    sent,
    send(data: string, cb?: (err?: Error) => void) {
      sent.push(data)
      cb?.()
    },
    close() {
      emitter.emit('close')
    },
    readyState: 1,
  }) as MockWebSocket
}

function createMockSocket(): Socket {
  return { remoteAddress: '127.0.0.1' } as Socket
}

describe('FeedWebSocketService', () => {
  let feedEvents: FeedEvents
  let service: FeedWebSocketService
  let ws: MockWebSocket
  let capture: ReturnType<typeof createCaptureLogger>

  beforeEach(() => {
    capture = createCaptureLogger()
    feedEvents = new FeedEvents()
    const appLogger = {
      forComponent: () => capture.logger,
    } as AppLogger

    service = new FeedWebSocketService(appLogger, feedEvents, noopOnError)
    service.onModuleInit()

    ws = createMockWebSocket()
    service.registerClient(ws, createMockSocket())
  })

  afterEach(async () => {
    ws.removeAllListeners()
    await service.onModuleDestroy()
  })

  it('registers subscribe without side effects on feed-changed listener', async () => {
    const changed: string[] = []
    feedEvents.on('feed-changed', feedId => changed.push(feedId))

    ws.emit('message', Buffer.from('subscribe feed-a feed-b'))
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(changed).toEqual([])
  })

  it('broadcasts feed updates only to subscribed clients', async () => {
    ws.emit('message', Buffer.from('subscribe my-feed'))
    await new Promise(resolve => setTimeout(resolve, 20))

    feedEvents.emit('feed-changed', 'my-feed')
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(ws.sent).toEqual(['FEED-UPDATE my-feed'])
  })

  it('stops broadcasting after client unsubscribes', async () => {
    ws.emit('message', Buffer.from('subscribe my-feed'))
    ws.emit('message', Buffer.from('unsubscribe my-feed'))
    await new Promise(resolve => setTimeout(resolve, 20))

    feedEvents.emit('feed-changed', 'my-feed')
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(ws.sent).toEqual([])
  })

  it('debounces rapid feed updates and sends one notification', async () => {
    ws.emit('message', Buffer.from('subscribe debounced-feed'))
    await new Promise(resolve => setTimeout(resolve, 20))

    feedEvents.emit('feed-changed', 'debounced-feed')
    feedEvents.emit('feed-changed', 'debounced-feed')
    feedEvents.emit('feed-changed', 'debounced-feed')
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(ws.sent).toEqual(['FEED-UPDATE debounced-feed'])
  })

  it('emits clients-changed when clients connect and disconnect', async () => {
    const counts: number[] = []
    feedEvents.on('clients-changed', count => counts.push(count))

    const secondClient = createMockWebSocket()
    service.registerClient(secondClient, createMockSocket())
    await vi.waitFor(() => expect(counts).toContain(2))

    secondClient.emit('close')
    await vi.waitFor(() => expect(counts).toContain(1))
  })
})
