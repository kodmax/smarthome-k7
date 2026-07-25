import { describe, expect, it } from 'vitest'
import { createRandomBoundaryToken } from './promptBoundary'

describe('createRandomBoundaryToken', () => {
  it('creates a 32-character hex token', () => {
    const token = createRandomBoundaryToken()

    expect(token).toMatch(/^[a-f0-9]{32}$/)
  })

  it('creates unique tokens', () => {
    expect(createRandomBoundaryToken()).not.toBe(createRandomBoundaryToken())
  })
})
