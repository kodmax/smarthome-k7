import { describe, expect, it } from 'vitest'
import { config } from '@/config'
import { setupEnv } from '@/test/setupEnv'

describe('config in tests', () => {
  it('uses geo location from setupEnv, not local .env', () => {
    expect(config.geoLocation.long).toBe(Number(setupEnv.LOCATION_LONG))
    expect(config.geoLocation.lat).toBe(Number(setupEnv.LOCATION_LAT))
  })

  it('uses transmission settings from setupEnv', () => {
    expect(config.transmission.url).toBe(setupEnv.TRANSMISSION_URL)
    expect(config.transmission.username).toBe(setupEnv.TRANSMISSION_USERNAME)
    expect(config.transmission.password).toBe(setupEnv.TRANSMISSION_PASSWORD)
  })
})
