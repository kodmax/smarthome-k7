import { describe, expect, it, vi } from 'vitest'
import { getBackendBaseUrl } from './getBackendBaseUrl'
import { getDefaultApiBaseUrl } from './getDefaultApiBaseUrl'
import { getDefaultWebSocketUrl } from './getDefaultWebSocketUrl'

const location = { origin: 'http://localhost:5173' } as Location

describe('backend URL helpers', () => {
  it('derives ws and api paths from page origin by default', () => {
    expect(getBackendBaseUrl(location)).toBe('http://localhost:5173')
    expect(getDefaultWebSocketUrl(location)).toBe('ws://localhost:5173/ws')
    expect(getDefaultApiBaseUrl(location)).toBe('http://localhost:5173/api')
  })

  it('derives ws and api paths from configured backend base', () => {
    vi.stubEnv('VITE_BACKEND_BASE_URL', 'https://smarthome.example.com/')

    expect(getBackendBaseUrl(location)).toBe('https://smarthome.example.com')
    expect(getDefaultWebSocketUrl(location)).toBe('wss://smarthome.example.com/ws')
    expect(getDefaultApiBaseUrl(location)).toBe('https://smarthome.example.com/api')

    vi.unstubAllEnvs()
  })
})
