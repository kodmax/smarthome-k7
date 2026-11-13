import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTools } from './tools'
import { registerWebMcp } from './register'
import type { WebTool } from './types'

vi.hoisted(() => {
  vi.stubGlobal('isSecureContext', true)
})
vi.unmock('@repo/feed-client')

const run = (name: string, input: Record<string, unknown> = {}, signal = new AbortController().signal) =>
  createTools()
    .find(tool => tool.name === name)!
    .execute(input, { signal })
const response = (value: unknown) =>
  new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } })

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('WebMCP tools', () => {
  it('rejects invalid commands before contacting the backend', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    expect(await run('control_light', { circuit: 'kitchen_lamp', state: 'toggle' })).toHaveProperty('error')
    expect(await run('search_torrents', { query: '  ' })).toHaveProperty('error')
    expect(await run('home_energy', { url: '/arbitrary' })).toHaveProperty('error')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('submits a magnet using the dashboard download command and forwards cancellation', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetch)
    const magnetLink = `magnet:?xt=urn:btih:${'a'.repeat(40)}&dn=Example`
    const signal = new AbortController().signal
    expect(await run('download_torrent', { magnetLink: `  ${magnetLink}  ` }, signal)).toMatchObject({
      status: 'command_accepted',
      magnetLink,
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/api/data-sources/transmission/command/download')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ torrent: magnetLink })
    expect(options.signal).toBe(signal)
    expect(createTools().find(tool => tool.name === 'download_torrent')?.annotations.readOnlyHint).toBe(false)
  })

  it.each([undefined, '', 'https://example.com/file.torrent', 'magnet:?dn=Example', 'magnet:?xt=urn:btih:invalid'])(
    'rejects invalid magnet input %s without sending a command',
    async magnetLink => {
      const fetch = vi.fn()
      vi.stubGlobal('fetch', fetch)
      expect(await run('download_torrent', { magnetLink })).toHaveProperty('error')
      expect(fetch).not.toHaveBeenCalled()
    },
  )

  it('reports failed downloads without claiming the command was accepted', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
    expect(await run('download_torrent', { magnetLink: `magnet:?xt=urn:btih:${'a'.repeat(40)}` })).toEqual({
      error: 'Command transmission.download: HTTP 503',
    })
  })

  it('forwards cancellation and fetches only temperature feeds', async () => {
    const fetch = vi.fn().mockImplementation(async () => response({ reading: { value: 21 } }))
    vi.stubGlobal('fetch', fetch)
    const controller = new AbortController()
    const result = await run('knx_temperatures', {}, controller.signal)
    expect(Object.keys(result as object)).toHaveLength(4)
    expect(fetch).toHaveBeenCalledTimes(4)
    for (const [url, options] of fetch.mock.calls) {
      expect(url).toContain('/api/feeds/home.temp.')
      expect(options.signal).toBe(controller.signal)
    }
    controller.abort()
    await expect(run('home_energy', {}, controller.signal)).rejects.toThrow()
  })

  it('returns backend failures to the agent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
    expect(await run('home_energy')).toEqual({ error: 'Feed energy: HTTP 503' })
    const result = await run('home_air_quality')
    expect(result).toHaveProperty(['home.air-quality.co2', 'error'], 'Feed home.air-quality.co2: HTTP 503')
  })

  it('validates the circuit and confirms the actual light state after sending a command', async () => {
    vi.useFakeTimers()
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response({ circuits: { kitchen_lamp: { reading: { value: 0 } } } }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(response({ circuits: { kitchen_lamp: { reading: { value: 1 } } } }))
    vi.stubGlobal('fetch', fetch)
    const result = run('control_light', { circuit: 'kitchen_lamp', state: 'on' })
    await vi.advanceTimersByTimeAsync(500)
    expect(await result).toMatchObject({ circuit: 'kitchen_lamp', state: 'on', confirmed: true })
    expect(fetch.mock.calls[1][0]).toContain('/api/data-sources/lights/command/set')
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ circuitId: 'kitchen_lamp', state: 'on' })
  })

  it('does not send commands for unknown circuits', async () => {
    const fetch = vi.fn().mockResolvedValue(response({ circuits: {} }))
    vi.stubGlobal('fetch', fetch)
    expect(await run('control_light', { circuit: 'missing', state: 'on' })).toMatchObject({ error: 'Unknown circuit' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('filters read news and normalizes ticker symbols', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          response({
            articles: [
              { uid: 'a', read: true },
              { uid: 'b', read: false },
            ],
          }),
        )
        .mockResolvedValueOnce(response({ tickers: [{ symbol: 'NVDA', price: 10 }] })),
    )
    expect(await run('news_headlines')).toEqual({ articles: [{ uid: 'b', read: false }] })
    expect(await run('stock_quote', { symbol: ' nvda ' })).toEqual({ symbol: 'NVDA', price: 10 })
  })
})

describe('WebMCP lifecycle', () => {
  it('is a no-op when the browser does not support WebMCP', () => {
    expect(() => registerWebMcp(undefined)()).not.toThrow()
  })

  it('registers all tools and aborts registration and executions on cleanup', async () => {
    const registered: WebTool[] = []
    const signals: AbortSignal[] = []
    const cleanup = registerWebMcp({
      registerTool: (tool, { signal }) => {
        registered.push(tool)
        signals.push(signal)
      },
    })
    await vi.waitFor(() => expect(registered).toHaveLength(16))
    expect(new Set(registered.map(tool => tool.name)).size).toBe(16)
    cleanup()
    expect(signals.every(signal => signal.aborted)).toBe(true)
    await expect(registered[0].execute({}, { signal: new AbortController().signal })).rejects.toThrow()
  })

  it('rolls back partial registration if a browser rejects a tool', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const signals: AbortSignal[] = []
    registerWebMcp({
      registerTool: (_, { signal }) => {
        signals.push(signal)
        if (signals.length === 2) throw new Error('Registration rejected')
      },
    })
    await vi.waitFor(() => expect(warn).toHaveBeenCalled())
    expect(signals.every(signal => signal.aborted)).toBe(true)
    warn.mockRestore()
  })
})
