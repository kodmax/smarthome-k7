import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEVICE_ID_STORAGE_KEY, ensureDeviceId, getDeviceId } from './getDeviceId'

describe('getDeviceId', () => {
  const storage = new Map<string, string>()
  let cookie = ''

  beforeEach(() => {
    storage.clear()
    cookie = ''
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value)
      },
      clear: () => {
        storage.clear()
      },
    })
    vi.stubGlobal('document', {
      get cookie() {
        return cookie
      },
      set cookie(value: string) {
        cookie = value
      },
    })
    vi.stubGlobal('location', { protocol: 'http:' })
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => '11111111-1111-4111-8111-111111111111'),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates and persists a device UUID in localStorage and cookie', () => {
    const deviceId = ensureDeviceId()

    expect(deviceId).toBe('11111111-1111-4111-8111-111111111111')
    expect(localStorage.getItem(DEVICE_ID_STORAGE_KEY)).toBe(deviceId)
    expect(document.cookie).toContain(`${DEVICE_ID_STORAGE_KEY}=${deviceId}`)
  })

  it('reuses an existing localStorage device UUID', () => {
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, '22222222-2222-4222-8222-222222222222')

    expect(ensureDeviceId()).toBe('22222222-2222-4222-8222-222222222222')
    expect(crypto.randomUUID).not.toHaveBeenCalled()
  })

  it('restores device UUID from cookie when localStorage is empty', () => {
    document.cookie = `${DEVICE_ID_STORAGE_KEY}=33333333-3333-4333-8333-333333333333; Path=/`

    expect(getDeviceId()).toBe('33333333-3333-4333-8333-333333333333')
    expect(localStorage.getItem(DEVICE_ID_STORAGE_KEY)).toBe('33333333-3333-4333-8333-333333333333')
  })
})
