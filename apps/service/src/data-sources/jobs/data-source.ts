import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { jjit } from './jjit/jjit'
import {
  JobAd,
  JobAdApplicationMeta,
  JobAdWithMeta,
  JobsCachedFeed,
  JobsFeed,
  emptyJobAdMeta,
  jobAdApplicationFromMeta,
} from '@repo/types'
import { nfj } from './nfj/nfj'
import { addAds } from './filters'
import { theprotocol } from './theprotocol'
import {
  applyStatusChange,
  emptyApplicationMeta,
  parseApplicationMeta,
  parseChangeStateCommandArgs,
  resolveStatusChangedAt,
} from './applicationMeta'
import { isMetaFlagTrue } from './metaFlag'

const META_RETENTION_DAYS = 90
const STALE_APPLIED_NO_RESPONSE_AFTER_DAYS = 14
const STALE_NO_RESPONSE_ARCHIVE_AFTER_DAYS = 30
const STALE_REJECTED_ARCHIVE_AFTER_DAYS = 7

type MetaRow = {
  item_uid: string
  attribute_name: string
  value: unknown
  last_update_timestamp?: Date | string
}

export class JobsSource extends DataSourceDefinition<JobsFeed, JobsCachedFeed> {
  @Inject('db')
  declare private db: Pool

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'change-state':
        await this.commandChangeState(args)
        break
      case 'fav':
        await this.commandFav(args)
        break
      case 'unfav':
        await this.commandUnfav(args)
        break
    }
  }

  private async commandChangeState(args: string): Promise<void> {
    const parsed = parseChangeStateCommandArgs(args)
    if (parsed === null) {
      return
    }

    await this.saveApplicationChange(parsed.id, {
      applyStatus: parsed.applyStatus,
      comment: parsed.comment,
    })
  }

  private async saveApplicationChange(
    itemId: string,
    input: { applyStatus: JobAdApplicationMeta['applyStatus']; comment?: string },
  ): Promise<void> {
    const current = await this.loadApplicationMeta(itemId)
    const next = applyStatusChange(current, input)
    if (next === null) {
      return
    }

    await this.writeApplicationMeta(itemId, next)
    this.push()
  }

  private async commandFav(itemId: string): Promise<void> {
    await this.markMeta(itemId, 'fav', true)
    this.push()
  }

  private async commandUnfav(itemId: string): Promise<void> {
    await this.unmarkMeta(itemId, 'fav')
    this.push()
  }

  getId() {
    return 'jobs'
  }

  getCron() {
    return '0 * * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  async getData() {
    const allAds = new Map<string, JobAd>()

    addAds(allAds, await jjit())
    addAds(allAds, await nfj())
    addAds(allAds, await theprotocol())

    return {
      ads: [...allAds.values()].sort(
        (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
      ),
    }
  }

  async composeContent(cached: JobsCachedFeed): Promise<JobsFeed> {
    return {
      ads: await this.attachMeta(cached.ads),
    }
  }

  async maintenance() {
    const conn = await this.db.getConnection()
    try {
      await conn.query(
        `delete from meta
         where group_id = ?
           and last_update_timestamp < current_timestamp() - interval ? day`,
        [this.getId(), META_RETENTION_DAYS],
      )

      const appliedChanged = await this.markStaleAppliedAsNoResponse(conn)
      const noResponseArchived = await this.markStaleNoResponseAsArchived(conn)
      const rejectedArchived = await this.markStaleRejectedAsArchived(conn)
      if (appliedChanged || noResponseArchived || rejectedArchived) {
        this.push()
      }
    } finally {
      conn.release()
    }
  }

  private async markStaleAppliedAsNoResponse(conn: Awaited<ReturnType<Pool['getConnection']>>): Promise<boolean> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - STALE_APPLIED_NO_RESPONSE_AFTER_DAYS)

    const result = await conn.query(
      `update meta
       set value = json_set(value, '$.applyStatus', 'no-response', '$.comment', cast(null as json))
       where group_id = ?
         and attribute_name = 'application'
         and json_unquote(json_extract(value, '$.applyStatus')) = 'applied'
         and json_extract(value, '$.appliedAt') is not null
         and json_unquote(json_extract(value, '$.appliedAt')) <= ?`,
      [this.getId(), cutoff.toISOString()],
    )

    return ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
  }

  private async markStaleNoResponseAsArchived(conn: Awaited<ReturnType<Pool['getConnection']>>): Promise<boolean> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - STALE_NO_RESPONSE_ARCHIVE_AFTER_DAYS)

    const result = await conn.query(
      `update meta
       set value = json_set(value, '$.applyStatus', 'archived', '$.comment', cast(null as json))
       where group_id = ?
         and attribute_name = 'application'
         and json_unquote(json_extract(value, '$.applyStatus')) = 'no-response'
         and json_extract(value, '$.appliedAt') is not null
         and json_unquote(json_extract(value, '$.appliedAt')) <= ?`,
      [this.getId(), cutoff.toISOString()],
    )

    return ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
  }

  private async markStaleRejectedAsArchived(conn: Awaited<ReturnType<Pool['getConnection']>>): Promise<boolean> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - STALE_REJECTED_ARCHIVE_AFTER_DAYS)

    const result = await conn.query(
      `update meta
       set value = json_set(value, '$.applyStatus', 'archived', '$.comment', cast(null as json))
       where group_id = ?
         and attribute_name = 'application'
         and json_unquote(json_extract(value, '$.applyStatus')) = 'rejected'
         and json_extract(value, '$.rejectedAt') is not null
         and json_unquote(json_extract(value, '$.rejectedAt')) <= ?`,
      [this.getId(), cutoff.toISOString()],
    )

    return ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
  }

  private async attachMeta(ads: JobAd[]): Promise<JobAdWithMeta[]> {
    if (ads.length === 0) {
      return []
    }

    const conn = await this.db.getConnection()
    try {
      const ids = ads.map(ad => ad.id)
      const rows = (await conn.query(
        `select item_uid, attribute_name, value, last_update_timestamp
         from meta
         where group_id = ?
           and attribute_name in ('application', 'fav')
           and item_uid in (?)`,
        [this.getId(), ids],
      )) as MetaRow[]

      const applicationById = new Map<string, JobAdApplicationMeta>()
      const applicationUpdatedAtById = new Map<string, Date | string>()
      const favIds = new Set<string>()

      for (const row of rows) {
        switch (row.attribute_name) {
          case 'application': {
            const parsed = parseApplicationMeta(row.value)
            if (parsed !== null) {
              applicationById.set(row.item_uid, parsed)
              if (row.last_update_timestamp !== undefined) {
                applicationUpdatedAtById.set(row.item_uid, row.last_update_timestamp)
              }
            }
            break
          }
          case 'fav':
            if (isMetaFlagTrue(row.value)) {
              favIds.add(row.item_uid)
            }
            break
        }
      }

      return ads.map(ad => {
        const application = applicationById.get(ad.id) ?? emptyApplicationMeta()
        const lastStatusChangeAt = applicationUpdatedAtById.get(ad.id)

        return {
          ...ad,
          meta: {
            ...emptyJobAdMeta(),
            application: jobAdApplicationFromMeta(
              application,
              resolveStatusChangedAt(application.applyStatus, lastStatusChangeAt),
            ),
            fav: favIds.has(ad.id),
          },
        }
      })
    } finally {
      conn.release()
    }
  }

  private async loadApplicationMeta(itemId: string): Promise<JobAdApplicationMeta> {
    const conn = await this.db.getConnection()
    try {
      const rows = (await conn.query(
        `select value
         from meta
         where group_id = ?
           and item_uid = ?
           and attribute_name = 'application'`,
        [this.getId(), itemId],
      )) as MetaRow[]

      const row = rows[0]
      if (row === undefined) {
        return emptyApplicationMeta()
      }

      return parseApplicationMeta(row.value) ?? emptyApplicationMeta()
    } finally {
      conn.release()
    }
  }

  private async writeApplicationMeta(itemId: string, meta: JobAdApplicationMeta): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await this.writeApplicationMetaOnConnection(conn, itemId, meta)
    } finally {
      conn.release()
    }
  }

  private async writeApplicationMetaOnConnection(
    conn: Awaited<ReturnType<Pool['getConnection']>>,
    itemId: string,
    meta: JobAdApplicationMeta,
  ): Promise<void> {
    await conn.query(
      `insert into meta (item_uid, attribute_name, group_id, value)
       values (?, 'application', ?, ?)
       on duplicate key update value = values(value), group_id = values(group_id)`,
      [itemId, this.getId(), JSON.stringify(meta)],
    )
  }

  private async markMeta(itemUid: string, attributeName: string, value: boolean): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await conn.query(
        `insert into meta (item_uid, attribute_name, group_id, value)
         values (?, ?, ?, ?)
         on duplicate key update value = values(value), group_id = values(group_id)`,
        [itemUid, attributeName, this.getId(), value],
      )
    } finally {
      conn.release()
    }
  }

  private async unmarkMeta(itemUid: string, attributeName: string): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await conn.query(`delete from meta where group_id = ? and item_uid = ? and attribute_name = ?`, [
        this.getId(),
        itemUid,
        attributeName,
      ])
    } finally {
      conn.release()
    }
  }
}
