import { describe, expect, it } from 'vitest'
import { digestManualId, normalizeManualAdvertUrl } from './digestManualId'

describe('digestManualId', () => {
  it('normalizes host and trailing slash', () => {
    expect(normalizeManualAdvertUrl('https://WWW.Example.com/jobs/123/')).toBe('https://example.com/jobs/123')
  })

  it('keeps query string', () => {
    expect(normalizeManualAdvertUrl('https://example.com/jobs?id=1')).toBe('https://example.com/jobs?id=1')
  })

  it('returns stable hash for equivalent URLs', () => {
    const first = digestManualId('https://www.example.com/job/1/')
    const second = digestManualId('https://example.com/job/1')
    expect(first).toBe(second)
  })

  it('returns different hash for different URLs', () => {
    expect(digestManualId('https://example.com/job/1')).not.toBe(digestManualId('https://example.com/job/2'))
  })
})
