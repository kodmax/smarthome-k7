import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { MySkillsFeed } from '@repo/types'
import type { Pool } from 'mariadb'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import {
  normalizeSkillComment,
  parseSetSkillCommandArgs,
  parseSetSkillCommentCommandArgs,
  skillRowToMySkill,
  type SetSkillCommandArgs,
  type SetSkillCommentCommandArgs,
  type SkillRecordRow,
} from './skillRecord'

type MySkillsCachedFeed = Record<string, never>

export class MySkillsSource extends DataSource<MySkillsFeed, MySkillsCachedFeed> {
  @Inject('db')
  declare private db: Pool

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'set-skill-level': {
        const parsed = parseSetSkillCommandArgs(args)
        if (parsed !== null) {
          await this.setSkillLevel(parsed)
        }
        break
      }
      case 'set-skill-comment': {
        const parsed = parseSetSkillCommentCommandArgs(args)
        if (parsed !== null) {
          await this.setSkillComment(parsed)
        }
        break
      }
    }
  }

  static getId() {
    return 'my-skills'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData(): Promise<MySkillsCachedFeed> {
    return {}
  }

  protected async composeContent(): Promise<MySkillsFeed> {
    return this.loadSkillsFromDb()
  }

  private async loadSkillsFromDb(): Promise<MySkillsFeed> {
    const conn = await this.db.getConnection()
    try {
      const rows = (await observeDbQuery('select', 'my_skills', () =>
        conn.query(
          `select skill_id, skill_name, experience_level, comment
         from my_skills
         order by skill_name`,
        ),
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

  public async setSkillLevel(input: SetSkillCommandArgs): Promise<void> {
    await this.upsertSkillLevel(input)
    void this.push()
  }

  public async setSkillComment(input: SetSkillCommentCommandArgs): Promise<void> {
    const updated = await this.updateSkillComment(input.id, normalizeSkillComment(input.comment))
    if (updated) {
      void this.push()
    }
  }

  private async upsertSkillLevel(input: SetSkillCommandArgs): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await observeDbQuery('insert', 'my_skills', () =>
        conn.query(
          `insert into my_skills (skill_id, skill_name, experience_level, comment)
         values (?, ?, ?, null)
         on duplicate key update
           skill_name = values(skill_name),
           experience_level = values(experience_level)`,
          [input.id, input.name, input.level],
        ),
      )
    } finally {
      conn.release()
    }
  }

  private async updateSkillComment(skillId: string, comment: string | null): Promise<boolean> {
    const conn = await this.db.getConnection()
    try {
      const result = await observeDbQuery('update', 'my_skills', () =>
        conn.query(`update my_skills set comment = ? where skill_id = ?`, [comment, skillId]),
      )

      return ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
    } finally {
      conn.release()
    }
  }
}
