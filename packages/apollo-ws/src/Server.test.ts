import { createServer } from 'net'
import WebSocket from 'ws'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Server } from './Server'

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

  beforeEach(async () => {
    port = await getFreePort()
    await Server.listen({ port }, async instance => {
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
    server.vent.on('feeds-request', feedIds => requested.push([...feedIds]))

    ws.send('subscribe feed-a feed-b')

    await vi.waitFor(() => expect(requested).toHaveLength(1))
    expect(requested[0]).toEqual(['feed-a', 'feed-b'])
  })

  it('parses refresh and emits feeds-refresh', async () => {
    const refreshed: string[][] = []
    server.vent.on('feeds-refresh', feedIds => refreshed.push([...feedIds]))

    ws.send('refresh weather jobs')

    await vi.waitFor(() => expect(refreshed).toHaveLength(1))
    expect(refreshed[0]).toEqual(['weather', 'jobs'])
  })

  it('parses command and emits command with joined args', async () => {
    const commands: Array<{ sourceId: string; name: string; args: string }> = []
    server.vent.on('command', command => commands.push(command))

    ws.send('command knx-light toggle on fast')

    await vi.waitFor(() => expect(commands).toHaveLength(1))
    expect(commands[0]).toEqual({
      sourceId: 'knx-light',
      name: 'toggle',
      args: 'on fast',
    })
  })

  it('broadcasts feed updates only to subscribed clients', async () => {
    const messages: string[] = []
    ws.on('message', data => messages.push(data.toString()))
    ws.send('subscribe my-feed')
    await new Promise(resolve => setTimeout(resolve, 20))

    server.vent.emit('feed', 'my-feed', { value: 1 })
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(messages).toEqual(['FEED my-feed {"value":1}'])
  })

  it('debounces rapid feed updates and sends the last value once', async () => {
    const messages: string[] = []
    ws.on('message', data => messages.push(data.toString()))
    ws.send('subscribe debounced-feed')
    await new Promise(resolve => setTimeout(resolve, 20))

    server.vent.emit('feed', 'debounced-feed', { value: 1 })
    server.vent.emit('feed', 'debounced-feed', { value: 2 })
    server.vent.emit('feed', 'debounced-feed', { value: 3 })
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(messages).toEqual(['FEED debounced-feed {"value":3}'])
  })
})
