import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockWsSubscribe = vi.fn()
const mockWsUnsubscribe = vi.fn()
let onFeedChanged: ((feedId: string) => void) | undefined
const noopSubscriber = vi.fn()

vi.mock('./fetchFeed', () => ({
  fetchFeed: vi.fn(),
}))

vi.mock('./WSClient', () => ({
  WSClient: vi.fn(function WSClientMock(_uri: string, callback: (feedId: string) => void) {
    onFeedChanged = callback
    return {
      subscribe: mockWsSubscribe,
      unsubscribe: mockWsUnsubscribe,
    }
  }),
}))

vi.mock('./getDefaultWebSocketUrl', () => ({
  getDefaultWebSocketUrl: () => 'ws://test',
}))

vi.mock('./getDeviceId', () => ({
  ensureDeviceId: vi.fn(),
}))

describe('subscribe', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    onFeedChanged = undefined

    const { fetchFeed } = await import('./fetchFeed')
    vi.mocked(fetchFeed).mockResolvedValue({ value: 1 })
  })

  it('fetches feed on FEED-UPDATE when subscribers exist', async () => {
    const { subscribe } = await import('./feed')
    const { fetchFeed } = await import('./fetchFeed')

    subscribe('weather', noopSubscriber)
    vi.mocked(fetchFeed).mockClear()

    onFeedChanged?.('weather')

    await vi.waitFor(() => expect(fetchFeed).toHaveBeenCalledWith('weather'))
  })

  it('skips fetch on FEED-UPDATE after all subscribers unsubscribe', async () => {
    const { subscribe } = await import('./feed')
    const { fetchFeed } = await import('./fetchFeed')

    const unsubscribe = subscribe('weather', noopSubscriber)
    unsubscribe()
    vi.mocked(fetchFeed).mockClear()

    onFeedChanged?.('weather')
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(fetchFeed).not.toHaveBeenCalled()
  })

  it('still fetches when one of multiple subscribers unsubscribes', async () => {
    const { subscribe } = await import('./feed')
    const { fetchFeed } = await import('./fetchFeed')

    const unsubscribeFirst = subscribe('weather', noopSubscriber)
    subscribe('weather', noopSubscriber)
    unsubscribeFirst()
    vi.mocked(fetchFeed).mockClear()

    onFeedChanged?.('weather')

    await vi.waitFor(() => expect(fetchFeed).toHaveBeenCalledWith('weather'))
  })

  it('sends ws unsubscribe when last subscriber leaves', async () => {
    const { subscribe } = await import('./feed')

    const unsubscribe = subscribe('weather', noopSubscriber)
    unsubscribe()

    expect(mockWsUnsubscribe).toHaveBeenCalledWith('weather')
  })
})
