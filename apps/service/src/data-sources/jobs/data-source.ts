import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { jjit } from './jjit/jjit'
import {
  JobAd,
  JobAdApplicationMeta,
  JobAdWithMeta,
  JobsFeed,
  emptyJobAdMeta,
  jobAdApplicationFromMeta,
} from '@repo/types'
import { nfj } from './nfj/nfj'
import { addAds } from './filters'
import { theprotocol } from './theprotocol'
import {
  applyStatusChange,
  applicationMetaFromLegacyApplied,
  emptyApplicationMeta,
  parseApplicationMeta,
  parseChangeStateCommandArgs,
  resolveStatusChangedAt,
  toAppliedAtIso,
} from './applicationMeta'
import { isMetaFlagTrue } from './metaFlag'

type MetaRow = {
  item_uid: string
  attribute_name: string
  value: unknown
  last_update_timestamp?: Date | string
}

export class JobsSource extends DataSourceDefinition<JobsFeed> {
  @Inject('db')
  declare private db: Pool
  public async handleCommand(command: string, args: string, recentContent?: JobsFeed): Promise<void> {
    switch (command) {
      case 'applied':
        await this.commandApplied(args, recentContent)
        break
      case 'change-state':
        await this.commandChangeState(args, recentContent)
        break
      case 'fav':
        await this.commandFav(args, recentContent)
        break
      case 'unfav':
        await this.commandUnfav(args, recentContent)
        break
    }
  }

  private async commandApplied(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.saveApplicationChange(itemId, { applyStatus: 'applied' }, recentContent)
  }

  private async commandChangeState(args: string, recentContent?: JobsFeed): Promise<void> {
    const parsed = parseChangeStateCommandArgs(args)
    if (parsed === null) {
      return
    }

    await this.saveApplicationChange(
      parsed.id,
      { applyStatus: parsed.applyStatus, comment: parsed.comment },
      recentContent,
    )
  }

  private async saveApplicationChange(
    itemId: string,
    input: { applyStatus: JobAdApplicationMeta['applyStatus']; comment?: string },
    recentContent?: JobsFeed,
  ): Promise<void> {
    const current = await this.loadApplicationMeta(itemId)
    const next = applyStatusChange(current, input)
    if (next === null) {
      return
    }

    const statusChanged = current.applyStatus !== next.applyStatus

    await this.writeApplicationMeta(itemId, next)
    this.pushAdUpdate(itemId, recentContent, ad => ({
      ...ad,
      meta: {
        ...ad.meta,
        application: jobAdApplicationFromMeta(
          next,
          statusChanged ? resolveStatusChangedAt(next.applyStatus, new Date()) : ad.meta.application.statusChangedAt,
        ),
      },
    }))
  }

  private async commandFav(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.markMeta(itemId, 'fav', true)
    this.pushAdUpdate(itemId, recentContent, ad => ({
      ...ad,
      meta: {
        ...ad.meta,
        fav: true,
      },
    }))
  }

  private async commandUnfav(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.unmarkMeta(itemId, 'fav')
    this.pushAdUpdate(itemId, recentContent, ad => ({
      ...ad,
      meta: {
        ...ad.meta,
        fav: false,
      },
    }))
  }

  private pushAdUpdate(
    itemId: string,
    recentContent: JobsFeed | undefined,
    update: (ad: JobAdWithMeta) => JobAdWithMeta,
  ): void {
    if (recentContent === undefined) {
      return
    }

    this.push({
      ads: recentContent.ads.map(ad => (ad.id === itemId ? update(ad) : ad)),
    })
  }

  getId() {
    return 'jobs'
  }

  getCron() {
    return '0 8 * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 15
  }

  async getData() {
    const allAds = new Map<string, JobAd>()

    addAds(allAds, await jjit())
    addAds(allAds, await nfj())
    addAds(allAds, await theprotocol())

    const ads = [...allAds.values()].sort(
      (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
    )

    return {
      ads: await this.attachMeta(ads),
    }
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
         where attribute_name in ('application', 'applied', 'fav')
           and item_uid in (?)`,
        [ids],
      )) as MetaRow[]

      const applicationById = new Map<string, JobAdApplicationMeta>()
      const applicationUpdatedAtById = new Map<string, Date | string>()
      const legacyAppliedAtById = new Map<string, string>()
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
          case 'applied':
            if (isMetaFlagTrue(row.value)) {
              legacyAppliedAtById.set(row.item_uid, toAppliedAtIso(row.last_update_timestamp ?? new Date()))
            }
            break
          case 'fav':
            if (isMetaFlagTrue(row.value)) {
              favIds.add(row.item_uid)
            }
            break
        }
      }

      return ads.map(ad => {
        const application =
          applicationById.get(ad.id) ??
          (legacyAppliedAtById.has(ad.id)
            ? applicationMetaFromLegacyApplied(legacyAppliedAtById.get(ad.id)!)
            : emptyApplicationMeta())
        const lastStatusChangeAt = applicationUpdatedAtById.get(ad.id) ?? legacyAppliedAtById.get(ad.id)

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
        `select attribute_name, value, last_update_timestamp
         from meta
         where item_uid = ?
           and attribute_name in ('application', 'applied')`,
        [itemId],
      )) as MetaRow[]

      const applicationRow = rows.find(row => row.attribute_name === 'application')
      if (applicationRow !== undefined) {
        return parseApplicationMeta(applicationRow.value) ?? emptyApplicationMeta()
      }

      const appliedRow = rows.find(row => row.attribute_name === 'applied' && isMetaFlagTrue(row.value))
      if (appliedRow !== undefined) {
        return applicationMetaFromLegacyApplied(toAppliedAtIso(appliedRow.last_update_timestamp ?? new Date()))
      }

      return emptyApplicationMeta()
    } finally {
      conn.release()
    }
  }

  private async writeApplicationMeta(itemId: string, meta: JobAdApplicationMeta): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await conn.query(
        `insert into meta (item_uid, attribute_name, value)
         values (?, 'application', ?)
         on duplicate key update value = values(value)`,
        [itemId, JSON.stringify(meta)],
      )
      await conn.query(`delete from meta where item_uid = ? and attribute_name = 'applied'`, [itemId])
    } finally {
      conn.release()
    }
  }

  private async markMeta(itemUid: string, attributeName: string, value: boolean): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await conn.query(
        `insert into meta (item_uid, attribute_name, value)
         values (?, ?, ?)
         on duplicate key update value = values(value)`,
        [itemUid, attributeName, value],
      )
    } finally {
      conn.release()
    }
  }

  private async unmarkMeta(itemUid: string, attributeName: string): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await conn.query(`delete from meta where item_uid = ? and attribute_name = ?`, [itemUid, attributeName])
    } finally {
      conn.release()
    }
  }
}
