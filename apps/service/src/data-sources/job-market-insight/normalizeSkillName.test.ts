import { describe, expect, it } from 'vitest'
import { normalizeSkillKey, unifySkillName } from './normalizeSkillName'

describe('normalizeSkillKey', () => {
  it('groups common js framework variants', () => {
    expect(normalizeSkillKey('React')).toBe('react')
    expect(normalizeSkillKey('React.js')).toBe('react')
    expect(normalizeSkillKey('ReactJS')).toBe('react')
    expect(normalizeSkillKey('React.JS')).toBe('react')
    expect(normalizeSkillKey('Node.js')).toBe('node')
    expect(normalizeSkillKey('NodeJS')).toBe('node')
    expect(normalizeSkillKey('Nest.js')).toBe('nest')
    expect(normalizeSkillKey('nestJS')).toBe('nest')
    expect(normalizeSkillKey('Next.js')).toBe('next')
    expect(normalizeSkillKey('Next JS')).toBe('next')
  })

  it('keeps script languages intact', () => {
    expect(normalizeSkillKey('JavaScript')).toBe('javascript')
    expect(normalizeSkillKey('TypeScript')).toBe('typescript')
  })

  it('groups dotnet and casing variants', () => {
    expect(normalizeSkillKey('.NET')).toBe('dotnet')
    expect(normalizeSkillKey('.Net')).toBe('dotnet')
  })
})

describe('unifySkillName', () => {
  it('returns canonical display names for fragmented variants', () => {
    expect(unifySkillName('React.js')).toBe('React')
    expect(unifySkillName('ReactJS')).toBe('React')
    expect(unifySkillName('NodeJS')).toBe('Node.js')
    expect(unifySkillName('Front-End')).toBe('Frontend')
    expect(unifySkillName('TailwindCSS')).toBe('Tailwind CSS')
  })

  it('preserves unknown skills as trimmed originals', () => {
    expect(unifySkillName('  Kafka  ')).toBe('Kafka')
  })
})
