import { describe, expect, it } from 'vitest'
import { getMarketCountdownRefreshDelay } from './getMarketCountdownRefreshDelay'

describe('getMarketCountdownRefreshDelay', () => {
  it('uses minute refresh above fifteen minutes', () => {
    expect(getMarketCountdownRefreshDelay(16 * 60_000, 1_040_000)).toBe(60_000 - (1_040_000 % 60_000))
  })

  it('uses second refresh at fifteen minutes or below but above five seconds', () => {
    expect(getMarketCountdownRefreshDelay(15 * 60_000, 1_050)).toBe(1_000 - 50)
    expect(getMarketCountdownRefreshDelay(30_000, 2_500)).toBe(1_000 - 500)
  })

  it('uses sub-second refresh in the final five seconds', () => {
    expect(getMarketCountdownRefreshDelay(4_000, 1_050)).toBe(100 - 50)
  })
})
