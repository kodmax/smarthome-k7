export type PopularTechnologyPresentation = {
  abbreviation: string
  color: string
}

export const popularTechnologyPresentation: Record<string, PopularTechnologyPresentation> = {
  react: { abbreviation: 'R', color: '#61DAFB' },
  typescript: { abbreviation: 'TS', color: '#3178C6' },
  node: { abbreviation: 'N', color: '#339933' },
  next: { abbreviation: 'Nx', color: '#111827' },
  javascript: { abbreviation: 'JS', color: '#F7DF1E' },
  aws: { abbreviation: 'A', color: '#FF9900' },
  docker: { abbreviation: 'D', color: '#2496ED' },
  postgresql: { abbreviation: 'PG', color: '#336791' },
  graphql: { abbreviation: 'G', color: '#E10098' },
  git: { abbreviation: 'Gi', color: '#F05032' },
}

export const getPopularTechnologyPresentation = (id: string): PopularTechnologyPresentation => {
  return (
    popularTechnologyPresentation[id] ?? {
      abbreviation: id.slice(0, 2).toUpperCase(),
      color: '#64748B',
    }
  )
}
