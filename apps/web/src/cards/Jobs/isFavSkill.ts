const favSkills = new Set<string>(['TypeScript', 'React', 'PostgreSQL', 'Nest.js'])

export const isFavSkill = (skill: string): boolean => {
  return favSkills.has(skill)
}
