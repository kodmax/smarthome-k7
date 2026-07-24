import { renderHook } from '@testing-library/react'
import { toTechnologyId } from '@repo/common'
import { JobMarketPopularTechnology } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { useFilteredPopularTechnologies } from './useFilteredPopularTechnologies'

const tech = (name: string, offersCount = 2): JobMarketPopularTechnology => ({
  id: toTechnologyId(name),
  name,
  offersCount,
  sharePercent: 10,
  medianSalary: 20_000,
})

describe('useFilteredPopularTechnologies', () => {
  const technologies = [tech('React'), tech('TypeScript'), tech('Node.js')]

  it('returns all technologies with original ranks when query is empty', () => {
    const { result } = renderHook(() => useFilteredPopularTechnologies(technologies, '  '))

    expect(result.current).toEqual([
      { rank: 1, technology: technologies[0] },
      { rank: 2, technology: technologies[1] },
      { rank: 3, technology: technologies[2] },
    ])
  })

  it('filters by case-insensitive name substring and keeps original ranks', () => {
    const { result } = renderHook(() => useFilteredPopularTechnologies(technologies, 'script'))

    expect(result.current).toEqual([{ rank: 2, technology: technologies[1] }])
  })

  it('puts exact name matches before substring matches', () => {
    const withR = [tech('React'), tech('Angular'), tech('R'), tech('Rust')]
    const { result } = renderHook(() => useFilteredPopularTechnologies(withR, 'r'))

    expect(result.current.map(({ technology, rank }) => ({ name: technology.name, rank }))).toEqual([
      { name: 'R', rank: 3 },
      { name: 'React', rank: 1 },
      { name: 'Angular', rank: 2 },
      { name: 'Rust', rank: 4 },
    ])
  })

  it('returns an empty list when technologies are undefined', () => {
    const { result } = renderHook(() => useFilteredPopularTechnologies(undefined, 'react'))

    expect(result.current).toEqual([])
  })

  it('does not recompute the list when only surrounding spaces change', () => {
    const { result, rerender } = renderHook(({ query }) => useFilteredPopularTechnologies(technologies, query), {
      initialProps: { query: 'script' },
    })

    const first = result.current
    rerender({ query: ' script ' })

    expect(result.current).toBe(first)
  })
})
