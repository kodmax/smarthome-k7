import { describe, expect, it } from 'vitest'
import { buildJobAdDedupKey } from './jobAdDedupKey'

describe('buildJobAdDedupKey', () => {
  it('normalizes company name and title case', () => {
    expect(buildJobAdDedupKey('Acme', 'React Dev')).toBe('acme -- REACT DEV')
    expect(buildJobAdDedupKey('ACME', 'react dev')).toBe('acme -- REACT DEV')
  })
})
