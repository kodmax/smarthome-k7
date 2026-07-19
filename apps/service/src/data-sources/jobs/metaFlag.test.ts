import { describe, expect, it } from 'vitest'
import { isMetaFlagTrue } from './metaFlag'

describe('isMetaFlagTrue', () => {
  it('accepts boolean and integer JSON true from MariaDB', () => {
    expect(isMetaFlagTrue(true)).toBe(true)
    expect(isMetaFlagTrue(1)).toBe(true)
    expect(isMetaFlagTrue(false)).toBe(false)
    expect(isMetaFlagTrue(0)).toBe(false)
  })
})
