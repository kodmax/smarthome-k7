import { describe, expect, it } from 'vitest'
import { toSkillId, toTechnologyId } from './skillId'

describe('toTechnologyId', () => {
  it('slugifies skill names and keeps #/+ distinguishable', () => {
    expect(toTechnologyId('Node.js')).toBe('node-js')
    expect(toTechnologyId('C')).toBe('c')
    expect(toTechnologyId('C#')).toBe('csharp')
    expect(toTechnologyId('C++')).toBe('cplusplus')
    expect(toTechnologyId('ES6')).toBe('es6')
    expect(toTechnologyId('ES6+')).toBe('es6plus')
  })
})

describe('toSkillId', () => {
  it('matches popular technology ids for fragmented skill names', () => {
    expect(toSkillId('React.js')).toBe('react')
    expect(toSkillId('ReactJS')).toBe('react')
    expect(toSkillId('TypeScript')).toBe('typescript')
    expect(toSkillId('REST API')).toBe('rest-api')
    expect(toSkillId('GitLab')).toBe('git')
    expect(toSkillId('Next.js (App Router)')).toBe('next-js')
  })

  it('maps C family skills to unique ids', () => {
    expect(toSkillId('C')).toBe('c')
    expect(toSkillId('C#')).toBe('csharp')
    expect(toSkillId('C++')).toBe('cplusplus')
  })

  it('maps HTML/CSS combo and CI/CD variants to stable ids', () => {
    expect(toSkillId('HTML / CSS')).toBe('html-plus-css')
    expect(toSkillId('HTML-CSS')).toBe('html-plus-css')
    expect(toSkillId('HTML5 / CSS3')).toBe('html-plus-css')
    expect(toSkillId('HTML5-CSS3')).toBe('html-plus-css')
    expect(toSkillId('CI/CD')).toBe('ci-cd')
  })

  it('slugifies unknown skills', () => {
    expect(toSkillId('  Kafka  ')).toBe('kafka')
  })
})
