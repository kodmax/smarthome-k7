export const DEVICE_ID_STORAGE_KEY = isSecureContext ? 'smarthome-device-id' : 'dev-device-id'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isValidDeviceId = (value: string): boolean => UUID_PATTERN.test(value)

const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

const writeCookie = (name: string, value: string): void => {
  if (typeof document === 'undefined') {
    return
  }

  const secure = isSecureContext ? '; Secure' : ''
  const maxAge = 10 * 365 * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

export const getDeviceId = (): string | undefined => {
  if (typeof localStorage === 'undefined') {
    return undefined
  }

  const fromStorage = localStorage.getItem(DEVICE_ID_STORAGE_KEY)
  if (fromStorage !== null && isValidDeviceId(fromStorage)) {
    return fromStorage
  }

  const fromCookie = readCookie(DEVICE_ID_STORAGE_KEY)
  if (fromCookie !== undefined && isValidDeviceId(fromCookie)) {
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, fromCookie)
    return fromCookie
  }

  return undefined
}

export const ensureDeviceId = (): string => {
  const existing = getDeviceId()
  if (existing !== undefined) {
    writeCookie(DEVICE_ID_STORAGE_KEY, existing)
    return existing
  }

  const deviceId = isSecureContext ? crypto.randomUUID() : `${Math.random()}`
  localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId)
  writeCookie(DEVICE_ID_STORAGE_KEY, deviceId)
  return deviceId
}
