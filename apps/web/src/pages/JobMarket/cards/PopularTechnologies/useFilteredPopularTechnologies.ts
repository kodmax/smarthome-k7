import { JobMarketPopularTechnology } from '@repo/types'
import { useMemo } from 'react'

export type RankedPopularTechnology = {
  rank: number
  technology: JobMarketPopularTechnology
}

export const useFilteredPopularTechnologies = (
  technologies: readonly JobMarketPopularTechnology[] | undefined,
  query: string,
): RankedPopularTechnology[] => {
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query])

  return useMemo(() => {
    if (technologies === undefined) {
      return []
    }

    const ranked = technologies.map((technology, index) => ({
      rank: index + 1,
      technology,
    }))

    if (normalizedQuery === '') {
      return ranked
    }

    return ranked
      .filter(({ technology }) => technology.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        const aExact = a.technology.name.toLowerCase() === normalizedQuery ? 0 : 1
        const bExact = b.technology.name.toLowerCase() === normalizedQuery ? 0 : 1
        if (aExact !== bExact) {
          return aExact - bExact
        }

        return a.rank - b.rank
      })
  }, [technologies, normalizedQuery])
}
