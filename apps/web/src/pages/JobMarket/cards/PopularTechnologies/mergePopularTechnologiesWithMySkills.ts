import { JobMarketPopularTechnology, MySkill } from '@repo/types'

export const mergePopularTechnologiesWithMySkills = (
  popularTechnologies: readonly JobMarketPopularTechnology[] | undefined,
  mySkills: readonly MySkill[] | undefined,
): JobMarketPopularTechnology[] => {
  const technologies = [...(popularTechnologies ?? [])]
  const knownIds = new Set(technologies.map(technology => technology.id))

  const missingMySkills = [...(mySkills ?? [])]
    .filter(skill => !knownIds.has(skill.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (skill): JobMarketPopularTechnology => ({
        id: skill.id,
        name: skill.name,
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      }),
    )

  return [...technologies, ...missingMySkills]
}
