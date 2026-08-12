import { fireEvent, renderWithTheme as render, screen } from '@/test/test-utils'
import { useCommand, useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed, JobMarketPopularTechnology, MySkillsFeed } from '@repo/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PopularTechnologies } from './PopularTechnologies'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
  useCommand: vi.fn(() => vi.fn()),
}))

const mockedUseFeed = vi.mocked(useFeed)
const mockedUseCommand = vi.mocked(useCommand)

const tech = (
  overrides: Partial<JobMarketPopularTechnology> & Pick<JobMarketPopularTechnology, 'id' | 'name'>,
): JobMarketPopularTechnology => ({
  offersCount: 2,
  sharePercent: 1,
  medianSalary: 20_000,
  ...overrides,
})

const insightFeed = (popularTechnologies: JobMarketPopularTechnology[]): JobMarketInsightFeed =>
  ({
    popularTechnologies,
  }) as JobMarketInsightFeed

describe('PopularTechnologies', () => {
  beforeEach(() => {
    mockedUseCommand.mockReturnValue(vi.fn())
    mockedUseFeed.mockImplementation((topic?: string) => {
      if (topic === 'my-skills') {
        return { skills: [] }
      }

      if (topic === 'job-market-insight') {
        return insightFeed([
          tech({ id: 'csharp', name: 'C#', offersCount: 14, sharePercent: 3, medianSalary: 15_500 }),
          tech({ id: 'es6', name: 'ES6+', offersCount: 2, sharePercent: 0, medianSalary: 14_840 }),
          tech({ id: 'html-plus-css', name: 'HTML + CSS', offersCount: 1, sharePercent: 0, medianSalary: 15_566 }),
          tech({ id: 'vue-js', name: 'Vue.js', offersCount: 4, sharePercent: 1, medianSalary: 19_431 }),
        ])
      }

      return undefined
    })
  })

  it('shows only matching technologies after search without duplicates', () => {
    render(<PopularTechnologies />)

    fireEvent.change(screen.getByPlaceholderText('Szukaj…'), {
      target: { value: 'vue' },
    })

    expect(screen.getAllByText('Vue.js')).toHaveLength(1)
    expect(screen.queryByText('ES6+')).not.toBeInTheDocument()
    expect(screen.queryByText('C#')).not.toBeInTheDocument()
    expect(screen.queryByText('HTML + CSS')).not.toBeInTheDocument()
  })

  it('restores the full list when search is cleared', () => {
    render(<PopularTechnologies />)

    const input = screen.getByPlaceholderText('Szukaj…')
    fireEvent.change(input, { target: { value: 'vue' } })
    fireEvent.change(input, { target: { value: '' } })

    expect(screen.getByText('Vue.js')).toBeInTheDocument()
    expect(screen.getByText('ES6+')).toBeInTheDocument()
    expect(screen.getByText('C#')).toBeInTheDocument()
  })

  it('shows my skills missing from popular technologies', () => {
    mockedUseFeed.mockImplementation((topic?: string) => {
      if (topic === 'my-skills') {
        return {
          skills: [{ id: 'java', name: 'Java', level: 'not-interested', comment: null }],
        } satisfies MySkillsFeed
      }

      if (topic === 'job-market-insight') {
        return insightFeed([
          tech({ id: 'react', name: 'React', offersCount: 14, sharePercent: 3, medianSalary: 15_500 }),
        ])
      }

      return undefined
    })

    render(<PopularTechnologies />)

    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
