import { describe, expect, it } from 'vitest'
import { normalizeSkillKey, isIgnoredSkillKey, unifySkillName } from './normalizeSkillName'

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
    expect(normalizeSkillKey('JS')).toBe('javascript')
    expect(normalizeSkillKey('TypeScript')).toBe('typescript')
  })

  it('groups dotnet and casing variants', () => {
    expect(normalizeSkillKey('.NET')).toBe('dotnet')
    expect(normalizeSkillKey('.Net')).toBe('dotnet')
  })

  it('groups aws variants', () => {
    expect(normalizeSkillKey('AWS')).toBe('aws')
    expect(normalizeSkillKey('Amazon AWS')).toBe('aws')
  })

  it('groups api variants', () => {
    expect(normalizeSkillKey('API')).toBe('api')
    expect(normalizeSkillKey('REST API')).toBe('api')
    expect(normalizeSkillKey('REST APIs')).toBe('api')
    expect(normalizeSkillKey('Rest API')).toBe('api')
    expect(normalizeSkillKey('REST')).toBe('api')
    expect(normalizeSkillKey('RESTful API')).toBe('api')
  })

  it('groups gitlab under git', () => {
    expect(normalizeSkillKey('Git')).toBe('git')
    expect(normalizeSkillKey('GitLab')).toBe('git')
  })

  it('groups ai tools under ai', () => {
    expect(normalizeSkillKey('AI')).toBe('ai')
    expect(normalizeSkillKey('AI Tools')).toBe('ai')
  })

  it('groups test automation under automated testing', () => {
    expect(normalizeSkillKey('Automated Testing')).toBe('automatedtesting')
    expect(normalizeSkillKey('Test automation')).toBe('automatedtesting')
  })

  it('groups html5 under html and css3 under css', () => {
    expect(normalizeSkillKey('HTML')).toBe('html')
    expect(normalizeSkillKey('HTML5')).toBe('html')
    expect(normalizeSkillKey('CSS')).toBe('css')
    expect(normalizeSkillKey('CSS3')).toBe('css')
  })

  it('groups spring under spring boot', () => {
    expect(normalizeSkillKey('Spring Boot')).toBe('springboot')
    expect(normalizeSkillKey('Spring')).toBe('springboot')
    expect(normalizeSkillKey('Spring Framework')).toBe('springframework')
  })

  it('groups tailwind under tailwind css', () => {
    expect(normalizeSkillKey('Tailwind CSS')).toBe('tailwindcss')
    expect(normalizeSkillKey('Tailwind')).toBe('tailwindcss')
    expect(normalizeSkillKey('TailwindCSS')).toBe('tailwindcss')
  })
})

describe('unifySkillName', () => {
  it('returns canonical display names for fragmented variants', () => {
    expect(unifySkillName('React.js')).toBe('React')
    expect(unifySkillName('ReactJS')).toBe('React')
    expect(unifySkillName('NodeJS')).toBe('Node.js')
    expect(unifySkillName('Front-End')).toBe('Frontend')
    expect(unifySkillName('TailwindCSS')).toBe('Tailwind CSS')
    expect(unifySkillName('Amazon AWS')).toBe('AWS')
    expect(unifySkillName('API')).toBe('REST API')
    expect(unifySkillName('REST API')).toBe('REST API')
    expect(unifySkillName('Rest API')).toBe('REST API')
    expect(unifySkillName('REST')).toBe('REST API')
    expect(unifySkillName('RESTful API')).toBe('REST API')
    expect(unifySkillName('REST APIs')).toBe('REST API')
    expect(unifySkillName('GitLab')).toBe('Git')
    expect(unifySkillName('AI Tools')).toBe('AI')
    expect(unifySkillName('Test automation')).toBe('Automated Testing')
    expect(unifySkillName('HTML5')).toBe('HTML')
    expect(unifySkillName('CSS3')).toBe('CSS')
    expect(unifySkillName('JS')).toBe('JavaScript')
    expect(unifySkillName('Spring')).toBe('Spring Boot')
    expect(unifySkillName('Tailwind')).toBe('Tailwind CSS')
  })

  it('preserves unknown skills as trimmed originals', () => {
    expect(unifySkillName('  Kafka  ')).toBe('Kafka')
  })
})

describe('isIgnoredSkillKey', () => {
  it('ignores generic skills that add no signal', () => {
    expect(isIgnoredSkillKey(normalizeSkillKey('Software Development'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Agile'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Scrum'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Data science'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Degree'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('UI'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Frontend'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Front-End'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Backend'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Fullstack'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Jira'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('JSON'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Testing'))).toBe(true)
    expect(isIgnoredSkillKey(normalizeSkillKey('Git'))).toBe(false)
    expect(isIgnoredSkillKey(normalizeSkillKey('GitLab'))).toBe(false)
    expect(isIgnoredSkillKey(normalizeSkillKey('React'))).toBe(false)
  })
})
