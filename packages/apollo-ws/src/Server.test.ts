import { createServer } from 'net'
import WebSocket from 'ws'
import { createCaptureLogger } from '@repo/logger'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Server } from './Server'
import { FeedEvents } from '@repo/feeds'

const noopOnError = (): void => void 0

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, () => {
      const address = server.address()
      const port = typeof address === 'object' && address !== null ? address.port : 0
      server.close(() => resolve(port))
    })
  })
}

function waitForOpen(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    ws.once('open', () => resolve())
    ws.once('error', reject)
  })
}

describe('Server', () => {
  let port: number
  let server: Server
  let ws: WebSocket
  let capture: ReturnType<typeof createCaptureLogger>
  let feedEvents: FeedEvents

  beforeEach(async () => {
    capture = createCaptureLogger()
    port = await getFreePort()
    feedEvents = new FeedEvents()
    await Server.listen({ port, logger: capture.logger, onError: noopOnError, feedEvents }, async instance => {
      server = instance
    })

    ws = new WebSocket(`ws://127.0.0.1:${port}`)
    await waitForOpen(ws)
  })

  afterEach(async () => {
    ws.close()
    await server.close()
  })

  it('parses subscribe and emits feeds-request', async () => {
    const requested: string[][] = []
    feedEvents.on('feeds-request', feedIds => requested.push([...feedIds]))

    ws.send('subscribe feed-a feed-b')

    await vi.waitFor(() => expect(requested).toHaveLength(1))
    expect(requested[0]).toEqual(['feed-a', 'feed-b'])
  })

  it('broadcasts feed updates only to subscribed clients', async () => {
    const messages: string[] = []
    ws.on('message', data => messages.push(data.toString()))
    ws.send('subscribe my-feed')
    await new Promise(resolve => setTimeout(resolve, 20))

    feedEvents.emit('feed', 'my-feed', { value: 1 })
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(messages).toEqual(['FEED my-feed {"value":1}'])
  })

  it('debounces rapid feed updates and sends the last value once', async () => {
    const messages: string[] = []
    ws.on('message', data => messages.push(data.toString()))
    ws.send('subscribe debounced-feed')
    await new Promise(resolve => setTimeout(resolve, 20))

    feedEvents.emit('feed', 'debounced-feed', { value: 1 })
    feedEvents.emit('feed', 'debounced-feed', { value: 2 })
    feedEvents.emit('feed', 'debounced-feed', { value: 3 })
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(messages).toEqual(['FEED debounced-feed {"value":3}'])
  })

  it('emits clients-changed when clients connect and disconnect', async () => {
    const counts: number[] = []
    feedEvents.on('clients-changed', count => counts.push(count))

    const secondClient = new WebSocket(`ws://127.0.0.1:${port}`)
    await waitForOpen(secondClient)
    await vi.waitFor(() => expect(counts).toContain(2))

    secondClient.close()
    await vi.waitFor(() => expect(counts).toContain(1))
  })
})
