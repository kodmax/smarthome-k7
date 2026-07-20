export type PopularTechnology = {
  id: string
  rank: number
  name: string
  abbreviation: string
  color: string
  offers: number
  share: string
  median: string
}

export const popularTechnologies: PopularTechnology[] = [
  {
    id: 'react',
    rank: 1,
    name: 'React',
    abbreviation: 'R',
    color: '#61DAFB',
    offers: 185,
    share: '72%',
    median: '27 000 zł',
  },
  {
    id: 'typescript',
    rank: 2,
    name: 'TypeScript',
    abbreviation: 'TS',
    color: '#3178C6',
    offers: 172,
    share: '67%',
    median: '28 000 zł',
  },
  {
    id: 'node',
    rank: 3,
    name: 'Node.js',
    abbreviation: 'N',
    color: '#339933',
    offers: 158,
    share: '61%',
    median: '29 000 zł',
  },
  {
    id: 'next',
    rank: 4,
    name: 'Next.js',
    abbreviation: 'Nx',
    color: '#111827',
    offers: 112,
    share: '44%',
    median: '27 500 zł',
  },
  {
    id: 'javascript',
    rank: 5,
    name: 'JavaScript',
    abbreviation: 'JS',
    color: '#F7DF1E',
    offers: 98,
    share: '38%',
    median: '26 000 zł',
  },
  {
    id: 'aws',
    rank: 6,
    name: 'AWS',
    abbreviation: 'A',
    color: '#FF9900',
    offers: 87,
    share: '34%',
    median: '30 000 zł',
  },
  {
    id: 'docker',
    rank: 7,
    name: 'Docker',
    abbreviation: 'D',
    color: '#2496ED',
    offers: 76,
    share: '30%',
    median: '28 500 zł',
  },
  {
    id: 'postgresql',
    rank: 8,
    name: 'PostgreSQL',
    abbreviation: 'PG',
    color: '#336791',
    offers: 71,
    share: '28%',
    median: '27 000 zł',
  },
  {
    id: 'graphql',
    rank: 9,
    name: 'GraphQL',
    abbreviation: 'G',
    color: '#E10098',
    offers: 54,
    share: '21%',
    median: '29 500 zł',
  },
  {
    id: 'git',
    rank: 10,
    name: 'Git',
    abbreviation: 'Gi',
    color: '#F05032',
    offers: 49,
    share: '19%',
    median: '26 500 zł',
  },
]
