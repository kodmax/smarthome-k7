import { describe, expect, it } from 'vitest'
import { DEVICE_ID_COOKIE, parseDeviceIdFromCookie } from './parseDeviceIdFromCookie'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('parseDeviceIdFromCookie', () => {
  it('returns device UUID from cookie header', () => {
    const deviceId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'

    expect(parseDeviceIdFromCookie(`${DEVICE_ID_COOKIE}=${deviceId}`)).toBe(deviceId)
  })

  it('generates a fallback UUID when cookie is missing', () => {
    expect(parseDeviceIdFromCookie(undefined)).toMatch(UUID_PATTERN)
  })

  it('generates a fallback UUID when cookie value is invalid', () => {
    expect(parseDeviceIdFromCookie(`${DEVICE_ID_COOKIE}=not-a-uuid`)).toMatch(UUID_PATTERN)
  })
})
