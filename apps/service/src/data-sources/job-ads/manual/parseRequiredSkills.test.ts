import { describe, expect, it } from 'vitest'
import { parseRequiredSkills } from './parseRequiredSkills'

describe('parseRequiredSkills', () => {
  it('trims and dedupes by skill id', () => {
    expect(parseRequiredSkills([' React ', 'React.js', 'TypeScript'])).toEqual(['React', 'TypeScript'])
  })

  it('returns empty array for empty input', () => {
    expect(parseRequiredSkills([])).toEqual([])
  })

  it('rejects non-array input', () => {
    expect(parseRequiredSkills(undefined)).toBeNull()
  })

  it('rejects non-string entries', () => {
    expect(parseRequiredSkills(['React', 1])).toBeNull()
  })
})
