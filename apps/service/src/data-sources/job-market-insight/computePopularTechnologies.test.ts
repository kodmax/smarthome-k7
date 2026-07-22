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

const makeFillerAds = (count: number, maxSalary = 10_000): JobAd[] =>
  Array.from({ length: count }, (_, index) => makeAd([`Filler${index}`], { from: maxSalary - 2_000, to: maxSalary }))

const withTopPaidAds = (ads: JobAd[]): JobAd[] => {
  const adsWithSalary = ads.filter(ad => ad.monthlySalaryRangeAfterTaxes !== undefined)
  const fillerCount = Math.max(0, adsWithSalary.length * 9 - ads.length)

  return [...ads, ...makeFillerAds(fillerCount)]
}

describe('toTechnologyId', () => {
  it('slugifies skill names', () => {
    expect(toTechnologyId('Node.js')).toBe('node-js')
    expect(toTechnologyId('C++')).toBe('c')
  })
})

describe('computePopularTechnologies', () => {
  it('returns an empty list when there are no ads', () => {
    expect(computePopularTechnologies([])).toEqual([])
  })

  it('returns an empty list when no ads have salary ranges', () => {
    expect(computePopularTechnologies([makeAd(['React']), makeAd(['TypeScript'])])).toEqual([])
  })

  it('counts ads without salary when computing the P90 threshold', () => {
    const salaryAds = [
      makeAd(['JavaScript'], { from: 28_000, to: 32_000 }),
      makeAd(['JavaScript'], { from: 28_000, to: 32_000 }),
      makeAd(['Node.js'], { from: 26_000, to: 30_000 }),
      makeAd(['Python'], { from: 18_000, to: 22_000 }),
      ...makeFillerAds(6),
    ]

    expect(computePopularTechnologies(salaryAds)).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 2,
        sharePercent: 100,
        medianSalary: 32_000,
      },
    ])

    expect(
      computePopularTechnologies([
        ...salaryAds,
        ...Array.from({ length: 20 }, (_, index) => makeAd([`NoSalary${index}`])),
      ]),
    ).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 2,
        sharePercent: 50,
        medianSalary: 32_000,
      },
    ])
  })

  it('uses only ads at or above the P90 salary range upper bound', () => {
    expect(
      computePopularTechnologies([
        makeAd(['JavaScript', 'React'], { from: 20_000, to: 24_000 }),
        makeAd(['JavaScript', 'TypeScript'], { from: 28_000, to: 32_000 }),
        makeAd(['Node.js'], { from: 26_000, to: 30_000 }),
        makeAd(['Python'], { from: 18_000, to: 22_000 }),
        ...makeFillerAds(6),
      ]),
    ).toEqual([])
  })

  it('excludes technologies that appear in fewer than two offers', () => {
    expect(
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['JavaScript', 'React'], { from: 20_000, to: 24_000 }),
          makeAd(['JavaScript', 'TypeScript'], { from: 28_000, to: 32_000 }),
          makeAd(['Node.js'], { from: 26_000, to: 30_000 }),
          makeAd(['Python'], { from: 18_000, to: 22_000 }),
        ]),
      ),
    ).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 2,
        sharePercent: 50,
        medianSalary: 28_000,
      },
    ])
  })

  it('counts offers, share and median salary per unified skill', () => {
    expect(
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['React', 'React.js', 'ReactJS'], { from: 20_000, to: 24_000 }),
          makeAd(['ReactJS'], { from: 28_000, to: 32_000 }),
        ]),
      ),
    ).toEqual([
      {
        id: 'react',
        name: 'React',
        offersCount: 2,
        sharePercent: 100,
        medianSalary: 28_000,
      },
    ])
  })

  it('unifies api, rest api and rest into a single technology', () => {
    expect(
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['API'], { from: 20_000, to: 24_000 }),
          makeAd(['REST API'], { from: 22_000, to: 26_000 }),
          makeAd(['REST APIs'], { from: 23_000, to: 27_000 }),
          makeAd(['REST'], { from: 24_000, to: 28_000 }),
          makeAd(['RESTful API'], { from: 25_000, to: 29_000 }),
          makeAd(['API', 'REST'], { from: 26_000, to: 30_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['Git'], { from: 20_000, to: 24_000 }),
          makeAd(['GitLab'], { from: 22_000, to: 26_000 }),
          makeAd(['Git', 'GitLab'], { from: 24_000, to: 28_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['AI'], { from: 20_000, to: 24_000 }),
          makeAd(['AI Tools'], { from: 22_000, to: 26_000 }),
          makeAd(['AI', 'AI Tools'], { from: 24_000, to: 28_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['Automated Testing'], { from: 20_000, to: 24_000 }),
          makeAd(['Test automation'], { from: 22_000, to: 26_000 }),
          makeAd(['Automated Testing', 'Test automation'], { from: 24_000, to: 28_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['HTML'], { from: 20_000, to: 24_000 }),
          makeAd(['HTML5'], { from: 22_000, to: 26_000 }),
          makeAd(['CSS'], { from: 24_000, to: 28_000 }),
          makeAd(['CSS3'], { from: 26_000, to: 30_000 }),
        ]),
      ),
    ).toEqual([
      {
        id: 'css',
        name: 'CSS',
        offersCount: 2,
        sharePercent: 50,
        medianSalary: 29_000,
      },
      {
        id: 'html',
        name: 'HTML',
        offersCount: 2,
        sharePercent: 50,
        medianSalary: 25_000,
      },
    ])
  })

  it('unifies js under javascript', () => {
    expect(
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['JavaScript'], { from: 20_000, to: 24_000 }),
          makeAd(['JS'], { from: 22_000, to: 26_000 }),
          makeAd(['JavaScript', 'JS'], { from: 24_000, to: 28_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['Spring Boot'], { from: 20_000, to: 24_000 }),
          makeAd(['Spring'], { from: 22_000, to: 26_000 }),
          makeAd(['Spring Boot', 'Spring'], { from: 24_000, to: 28_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
          makeAd(['Tailwind CSS'], { from: 20_000, to: 24_000 }),
          makeAd(['Tailwind'], { from: 22_000, to: 26_000 }),
          makeAd(['TailwindCSS'], { from: 24_000, to: 28_000 }),
        ]),
      ),
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
      computePopularTechnologies(
        withTopPaidAds([
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
          makeAd(['Software Development'], { from: 22_000, to: 26_000 }),
        ]),
      ),
    ).toEqual([])
  })
})
