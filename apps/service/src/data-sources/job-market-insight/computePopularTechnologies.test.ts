import { toTechnologyId } from '@repo/common'
import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computePopularTechnologies } from './computePopularTechnologies'

const makeAd = (requiredSkills: string[], salary?: { from: number; to: number }): JobAd => ({
  id: `${requiredSkills.join('-')}-${salary?.from ?? 'none'}`,
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills,
  workplaceType: 'remote',
  employmentType: 'permanent',
  publishedAt: '2026-01-01T00:00:00.000Z',
  monthlySalaryRangeAfterTaxes: salary,
})

describe('toTechnologyId', () => {
  it('slugifies skill names and keeps #/+ distinguishable', () => {
    expect(toTechnologyId('Node.js')).toBe('node-js')
    expect(toTechnologyId('C')).toBe('c')
    expect(toTechnologyId('C#')).toBe('csharp')
    expect(toTechnologyId('C++')).toBe('cplusplus')
  })
})

describe('computePopularTechnologies', () => {
  it('returns an empty list when there are no ads', () => {
    expect(computePopularTechnologies([])).toEqual([])
  })

  it('counts ads without salary and leaves median null', () => {
    expect(
      computePopularTechnologies([makeAd(['React']), makeAd(['React']), makeAd(['React']), makeAd(['TypeScript'])]),
    ).toEqual([
      {
        id: 'react',
        name: 'React',
        offersCount: 3,
        sharePercent: 75,
        medianSalary: null,
      },
    ])
  })

  it('includes technologies from all salary ranges', () => {
    expect(
      computePopularTechnologies([
        makeAd(['Python'], { from: 18_000, to: 22_000 }),
        makeAd(['Python'], { from: 19_000, to: 23_000 }),
        makeAd(['Python'], { from: 20_000, to: 24_000 }),
        makeAd(['JavaScript'], { from: 28_000, to: 32_000 }),
        makeAd(['JavaScript'], { from: 30_000, to: 34_000 }),
        makeAd(['JavaScript'], { from: 31_000, to: 35_000 }),
      ]),
    ).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 3,
        sharePercent: 50,
        medianSalary: 34_000,
      },
      {
        id: 'python',
        name: 'Python',
        offersCount: 3,
        sharePercent: 50,
        medianSalary: 23_000,
      },
    ])
  })

  it('excludes technologies that appear in fewer than three offers', () => {
    expect(
      computePopularTechnologies([
        makeAd(['JavaScript', 'React'], { from: 20_000, to: 24_000 }),
        makeAd(['JavaScript', 'TypeScript'], { from: 28_000, to: 32_000 }),
        makeAd(['JavaScript', 'Node.js'], { from: 26_000, to: 30_000 }),
        makeAd(['Python'], { from: 18_000, to: 22_000 }),
      ]),
    ).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 3,
        sharePercent: 75,
        medianSalary: 30_000,
      },
    ])
  })

  it('counts offers, share and median salary per unified skill', () => {
    expect(
      computePopularTechnologies([
        makeAd(['React', 'React.js', 'ReactJS'], { from: 20_000, to: 24_000 }),
        makeAd(['ReactJS'], { from: 28_000, to: 32_000 }),
        makeAd(['React.js'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'react',
        name: 'React',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 28_000,
      },
    ])
  })

  it('unifies api, rest api and rest into a single technology', () => {
    expect(
      computePopularTechnologies([
        makeAd(['API'], { from: 20_000, to: 24_000 }),
        makeAd(['REST API'], { from: 22_000, to: 26_000 }),
        makeAd(['REST APIs'], { from: 23_000, to: 27_000 }),
        makeAd(['REST'], { from: 24_000, to: 28_000 }),
        makeAd(['RESTful API'], { from: 25_000, to: 29_000 }),
        makeAd(['API', 'REST'], { from: 26_000, to: 30_000 }),
      ]),
    ).toEqual([
      {
        id: 'rest-api',
        name: 'REST API',
        offersCount: 6,
        sharePercent: 100,
        medianSalary: 27_500,
      },
    ])
  })

  it('unifies gitlab under git', () => {
    expect(
      computePopularTechnologies([
        makeAd(['Git'], { from: 20_000, to: 24_000 }),
        makeAd(['GitLab'], { from: 22_000, to: 26_000 }),
        makeAd(['Git', 'GitLab'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'git',
        name: 'Git',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('unifies ai tools under ai', () => {
    expect(
      computePopularTechnologies([
        makeAd(['AI'], { from: 20_000, to: 24_000 }),
        makeAd(['AI Tools'], { from: 22_000, to: 26_000 }),
        makeAd(['AI', 'AI Tools'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'ai',
        name: 'AI',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('unifies test automation under automated testing', () => {
    expect(
      computePopularTechnologies([
        makeAd(['Automated Testing'], { from: 20_000, to: 24_000 }),
        makeAd(['Test automation'], { from: 22_000, to: 26_000 }),
        makeAd(['Automated Testing', 'Test automation'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'automated-testing',
        name: 'Automated Testing',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('unifies html5 under html and css3 under css', () => {
    expect(
      computePopularTechnologies([
        makeAd(['HTML'], { from: 20_000, to: 24_000 }),
        makeAd(['HTML5'], { from: 22_000, to: 26_000 }),
        makeAd(['HTML5'], { from: 23_000, to: 27_000 }),
        makeAd(['CSS'], { from: 24_000, to: 28_000 }),
        makeAd(['CSS3'], { from: 26_000, to: 30_000 }),
        makeAd(['CSS3'], { from: 27_000, to: 31_000 }),
      ]),
    ).toEqual([
      {
        id: 'css',
        name: 'CSS',
        offersCount: 3,
        sharePercent: 50,
        medianSalary: 30_000,
      },
      {
        id: 'html',
        name: 'HTML',
        offersCount: 3,
        sharePercent: 50,
        medianSalary: 26_000,
      },
    ])
  })

  it('unifies HTML/CSS combo label variants under one technology', () => {
    expect(
      computePopularTechnologies([
        makeAd(['HTML / CSS'], { from: 14_000, to: 16_000 }),
        makeAd(['HTML-CSS'], { from: 15_000, to: 17_000 }),
        makeAd(['HTML5 / CSS3'], { from: 16_000, to: 18_000 }),
        makeAd(['HTML5-CSS3'], { from: 17_000, to: 19_000 }),
      ]),
    ).toEqual([
      {
        id: 'html-plus-css',
        name: 'HTML + CSS',
        offersCount: 4,
        sharePercent: 100,
        medianSalary: 17_500,
      },
    ])
  })

  it('unifies js under javascript', () => {
    expect(
      computePopularTechnologies([
        makeAd(['JavaScript'], { from: 20_000, to: 24_000 }),
        makeAd(['JS'], { from: 22_000, to: 26_000 }),
        makeAd(['JavaScript', 'JS'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('unifies spring under spring boot', () => {
    expect(
      computePopularTechnologies([
        makeAd(['Spring Boot'], { from: 20_000, to: 24_000 }),
        makeAd(['Spring'], { from: 22_000, to: 26_000 }),
        makeAd(['Spring Boot', 'Spring'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('unifies tailwind under tailwind css', () => {
    expect(
      computePopularTechnologies([
        makeAd(['Tailwind CSS'], { from: 20_000, to: 24_000 }),
        makeAd(['Tailwind'], { from: 22_000, to: 26_000 }),
        makeAd(['TailwindCSS'], { from: 24_000, to: 28_000 }),
      ]),
    ).toEqual([
      {
        id: 'tailwind-css',
        name: 'Tailwind CSS',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('ignores generic skills that add no signal', () => {
    expect(
      computePopularTechnologies([
        makeAd(
          [
            'Software Development',
            'Agile',
            'Scrum',
            'Backend',
            'Data science',
            'Degree',
            'UI',
            'Frontend',
            'Fullstack',
            'Jira',
            'JSON',
            'Testing',
            'React',
          ],
          { from: 20_000, to: 24_000 },
        ),
        makeAd(['Software Development', 'React'], { from: 22_000, to: 26_000 }),
        makeAd(['React'], { from: 23_000, to: 27_000 }),
      ]),
    ).toEqual([
      {
        id: 'react',
        name: 'React',
        offersCount: 3,
        sharePercent: 100,
        medianSalary: 26_000,
      },
    ])
  })

  it('keeps C, C# and C++ as distinct technologies with unique ids', () => {
    const result = computePopularTechnologies([
      makeAd(['C'], { from: 10_000, to: 12_000 }),
      makeAd(['C'], { from: 10_500, to: 12_500 }),
      makeAd(['C'], { from: 11_000, to: 13_000 }),
      makeAd(['C#'], { from: 14_000, to: 16_000 }),
      makeAd(['C#'], { from: 14_500, to: 16_500 }),
      makeAd(['C#'], { from: 15_000, to: 17_000 }),
      makeAd(['C++'], { from: 15_000, to: 17_000 }),
      makeAd(['C++'], { from: 15_500, to: 17_500 }),
      makeAd(['C++'], { from: 16_000, to: 18_000 }),
      makeAd(['ES6'], { from: 11_000, to: 13_000 }),
      makeAd(['ES6+'], { from: 12_000, to: 14_000 }),
    ])

    expect(result.map(({ id, name }) => ({ id, name }))).toEqual([
      { id: 'c', name: 'C' },
      { id: 'csharp', name: 'C#' },
      { id: 'cplusplus', name: 'C++' },
    ])
    expect(new Set(result.map(({ id }) => id)).size).toBe(result.length)
  })
})
