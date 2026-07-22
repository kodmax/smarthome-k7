import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { MySkillsFeed } from '@repo/types'
import type { Pool } from 'mariadb'
import { Inject } from '@/di'
import {
  normalizeSkillComment,
  parseSetSkillCommandArgs,
  parseSetSkillCommentCommandArgs,
  skillRowToMySkill,
  type SkillRecordRow,
} from './skillRecord'

type MySkillsCachedFeed = Record<string, never>

export class MySkillsSource extends DataSourceDefinition<MySkillsFeed, MySkillsCachedFeed> {
  @Inject('db')
  declare private db: Pool

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'set-skill':
        await this.commandSetSkill(args)
        break
      case 'set-skill-comment':
        await this.commandSetSkillComment(args)
        break
    }
  }

  getId() {
    return 'my-skills'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  async getData(): Promise<MySkillsCachedFeed> {
    return {}
  }

  async composeContent(): Promise<MySkillsFeed> {
    return this.loadSkillsFromDb()
  }

  private async loadSkillsFromDb(): Promise<MySkillsFeed> {
    const conn = await this.db.getConnection()
    try {
      const rows = (await conn.query(
        `select skill_id, skill_name, experience_level, comment
         from my_skills
         order by skill_name`,
      )) as SkillRecordRow[]

      return {
        skills: rows.flatMap(row => {
          const skill = skillRowToMySkill(row)
          return skill === null ? [] : [skill]
        }),
      }
    } finally {
      conn.release()
    }
  }

  private async commandSetSkill(args: string): Promise<void> {
    const parsed = parseSetSkillCommandArgs(args)
    if (parsed === null) {
      return
    }

    await this.upsertSkillLevel(parsed)
    this.push()
  }

  private async commandSetSkillComment(args: string): Promise<void> {
    const parsed = parseSetSkillCommentCommandArgs(args)
    if (parsed === null) {
      return
    }

    const updated = await this.updateSkillComment(parsed.id, normalizeSkillComment(parsed.comment))
    if (updated) {
      this.push()
    }
  }

  private async upsertSkillLevel(input: { id: string; name: string; level: string }): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await conn.query(
        `insert into my_skills (skill_id, skill_name, experience_level, comment)
         values (?, ?, ?, null)
         on duplicate key update
           skill_name = values(skill_name),
           experience_level = values(experience_level)`,
        [input.id, input.name, input.level],
      )
    } finally {
      conn.release()
    }
  }

  private async updateSkillComment(skillId: string, comment: string | null): Promise<boolean> {
    const conn = await this.db.getConnection()
    try {
      const result = await conn.query(`update my_skills set comment = ? where skill_id = ?`, [comment, skillId])

      return ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
    } finally {
      conn.release()
    }
  }
}
