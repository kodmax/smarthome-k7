import { randomUUID } from 'node:crypto'

export const DEVICE_ID_COOKIE = 'smarthome-device-id'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const readCookieValue = (cookieHeader: string | undefined, name: string): string | undefined => {
  if (cookieHeader === undefined) {
    return undefined
  }

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = part.slice(0, separatorIndex).trim()
    if (key !== name) {
      continue
    }

    return decodeURIComponent(part.slice(separatorIndex + 1).trim())
  }

  return undefined
}

export const parseDeviceIdFromCookie = (cookieHeader: string | undefined): string => {
  const value = readCookieValue(cookieHeader, DEVICE_ID_COOKIE)
  if (value !== undefined && UUID_PATTERN.test(value)) {
    return value
  }

  return randomUUID()
}
