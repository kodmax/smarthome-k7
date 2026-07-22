import { describe, expect, it } from 'vitest'
import { toSkillId, toTechnologyId } from './skillId'

describe('toTechnologyId', () => {
  it('slugifies skill names', () => {
    expect(toTechnologyId('Node.js')).toBe('node-js')
    expect(toTechnologyId('C++')).toBe('c')
  })
})

describe('toSkillId', () => {
  it('matches popular technology ids for fragmented skill names', () => {
    expect(toSkillId('React.js')).toBe('react')
    expect(toSkillId('ReactJS')).toBe('react')
    expect(toSkillId('TypeScript')).toBe('typescript')
    expect(toSkillId('REST API')).toBe('rest-api')
    expect(toSkillId('GitLab')).toBe('git')
  })

  it('slugifies unknown skills', () => {
    expect(toSkillId('  Kafka  ')).toBe('kafka')
  })
})
