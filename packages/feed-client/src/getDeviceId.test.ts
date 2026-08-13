import { afterEach, describe, expect, it, vi } from 'vitest'

const loadGetDeviceId = async (isSecureContext: boolean) => {
  vi.stubGlobal('isSecureContext', isSecureContext)
  vi.resetModules()
  return import('./getDeviceId')
}

describe('getDeviceId', () => {
  const storage = new Map<string, string>()
  let cookie = ''

  const setupStorage = () => {
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
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => '11111111-1111-4111-8111-111111111111'),
    })
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('creates a dev device id in non-secure context', async () => {
    setupStorage()
    const { DEVICE_ID_STORAGE_KEY, ensureDeviceId } = await loadGetDeviceId(false)

    expect(DEVICE_ID_STORAGE_KEY).toBe('dev-device-id')

    const deviceId = ensureDeviceId()

    expect(deviceId).toMatch(/^0\.\d+/)
    expect(localStorage.getItem(DEVICE_ID_STORAGE_KEY)).toBe(deviceId)
    expect(document.cookie).toContain(`${DEVICE_ID_STORAGE_KEY}=${deviceId}`)
    expect(crypto.randomUUID).not.toHaveBeenCalled()
  })

  it('creates and persists a device UUID in secure context', async () => {
    setupStorage()
    const { DEVICE_ID_STORAGE_KEY, ensureDeviceId } = await loadGetDeviceId(true)

    expect(DEVICE_ID_STORAGE_KEY).toBe('smarthome-device-id')

    const deviceId = ensureDeviceId()

    expect(deviceId).toBe('11111111-1111-4111-8111-111111111111')
    expect(localStorage.getItem(DEVICE_ID_STORAGE_KEY)).toBe(deviceId)
    expect(document.cookie).toContain(`${DEVICE_ID_STORAGE_KEY}=${deviceId}`)
  })

  it('reuses an existing localStorage device UUID', async () => {
    setupStorage()
    const { DEVICE_ID_STORAGE_KEY, ensureDeviceId } = await loadGetDeviceId(true)

    localStorage.setItem(DEVICE_ID_STORAGE_KEY, '22222222-2222-4222-8222-222222222222')

    expect(ensureDeviceId()).toBe('22222222-2222-4222-8222-222222222222')
    expect(crypto.randomUUID).not.toHaveBeenCalled()
  })

  it('restores device UUID from cookie when localStorage is empty', async () => {
    setupStorage()
    const { DEVICE_ID_STORAGE_KEY, getDeviceId } = await loadGetDeviceId(true)

    document.cookie = `${DEVICE_ID_STORAGE_KEY}=33333333-3333-4333-8333-333333333333; Path=/`

    expect(getDeviceId()).toBe('33333333-3333-4333-8333-333333333333')
    expect(localStorage.getItem(DEVICE_ID_STORAGE_KEY)).toBe('33333333-3333-4333-8333-333333333333')
  })
})
