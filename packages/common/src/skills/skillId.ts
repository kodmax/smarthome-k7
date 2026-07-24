import { unifySkillName } from './normalizeSkillName'

export const toTechnologyId = (skill: string): string =>
  skill
    .toLowerCase()
    .replaceAll('++', 'plusplus')
    .replaceAll('#', 'sharp')
    .replaceAll('+', 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'unknown'

export const toSkillId = (skill: string): string => toTechnologyId(unifySkillName(skill))
