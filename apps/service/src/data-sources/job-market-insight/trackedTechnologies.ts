export type TrackedTechnology = {
  id: string
  name: string
  skills: string[]
}

export const TRACKED_TECHNOLOGIES: TrackedTechnology[] = [
  { id: 'javascript', name: 'JavaScript', skills: ['JavaScript'] },
  { id: 'typescript', name: 'TypeScript', skills: ['TypeScript'] },
  { id: 'react', name: 'React', skills: ['React', 'React.js'] },
  { id: 'node', name: 'Node.js', skills: ['Node.js'] },
  { id: 'next', name: 'Next.js', skills: ['Next.js'] },
  { id: 'git', name: 'Git', skills: ['Git'] },
  { id: 'aws', name: 'AWS', skills: ['AWS'] },
  { id: 'docker', name: 'Docker', skills: ['Docker'] },
  { id: 'postgresql', name: 'PostgreSQL', skills: ['PostgreSQL'] },
  { id: 'graphql', name: 'GraphQL', skills: ['GraphQL'] },
]

export const POPULAR_TECHNOLOGIES_LIMIT = 10
