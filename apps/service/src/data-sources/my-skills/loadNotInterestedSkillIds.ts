import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'

export async function loadNotInterestedSkillIds(db: Sql): Promise<Set<string>> {
  const rows = await observeDbQuery(
    'select',
    'my_skills',
    () =>
      db<Array<{ skill_id: string }>>`
      select skill_id
      from my_skills
      where experience_level = 'not-interested'
    `,
  )

  return new Set(rows.map(row => row.skill_id))
}
