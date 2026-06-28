import { describe, expect, it } from 'vitest'
import { config } from '@/config'
import { setupEnv } from '@/test/setupEnv'

describe('config in tests', () => {
  it('uses geo location from setupEnv, not local .env', () => {
    expect(config.geoLocation.long).toBe(Number(setupEnv.LOCATION_LONG))
    expect(config.geoLocation.lat).toBe(Number(setupEnv.LOCATION_LAT))
  })
})
