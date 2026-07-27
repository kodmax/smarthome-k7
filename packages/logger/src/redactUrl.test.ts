import { describe, expect, it } from 'vitest'
import { redactUrl } from './redactUrl'

describe('redactUrl', () => {
  it('returns protocol and host without credentials', () => {
    expect(redactUrl('redis://:secret@redis.example.com:6379/0')).toBe('redis://redis.example.com:6379')
  })

  it('returns invalid marker for malformed urls', () => {
    expect(redactUrl('not-a-url')).toBe('[invalid-url]')
  })
})
