import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import db from '@/db'
import { jjit } from './jjit/jjit'
import { JobAd, JobsFeed } from '@repo/types'
import { nfj } from './nfj/nfj'
import { addAds } from './filters'

export class JobsSource extends DataSourceDefinition<JobsFeed> {
  public async handleCommand(command: string, args: string, recentContent?: JobsFeed): Promise<void> {
    switch (command) {
      case 'applied':
        await this.commandApplied(args, recentContent)
        break
      case 'hide':
        await this.commandHide(args, recentContent)
        break
      case 'restore':
        await this.commandRestore(args, recentContent)
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
    await this.markMeta(itemId, 'applied', true)
    this.pushAdUpdate(itemId, recentContent, { applied: true })
  }

  private async commandHide(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.markMeta(itemId, 'hide', true)
    this.pushAdUpdate(itemId, recentContent, { hide: true })
  }

  private async commandRestore(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.unmarkMeta(itemId, 'hide')
    this.pushAdUpdate(itemId, recentContent, { hide: false })
  }

  private async commandFav(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.markMeta(itemId, 'fav', true)
    this.pushAdUpdate(itemId, recentContent, { fav: true })
  }

  private async commandUnfav(itemId: string, recentContent?: JobsFeed): Promise<void> {
    await this.unmarkMeta(itemId, 'fav')
    this.pushAdUpdate(itemId, recentContent, { fav: false })
  }

  private pushAdUpdate(
    itemId: string,
    recentContent: JobsFeed | undefined,
    patch: Partial<Pick<JobAd, 'applied' | 'hide' | 'fav'>>,
  ): void {
    if (recentContent === undefined) {
      return
    }

    this.push({
      ads: recentContent.ads.map(ad => (ad.id === itemId ? { ...ad, ...patch } : ad)),
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
    // addAds(allAds, await theprotocol())

    const ads = [...allAds.values()].sort(
      (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
    )

    return {
      ads: await this.withMetaState(ads),
    }
  }

  private async withMetaState(ads: JobAd[]): Promise<JobAd[]> {
    if (ads.length === 0) {
      return []
    }

    const conn = await db.getConnection()
    try {
      const ids = ads.map(ad => ad.id)
      const rows = (await conn.query(
        `select item_uid, attribute_name from meta
         where attribute_name in ('applied', 'hide', 'fav')
           and item_uid in (?)
           and value = true`,
        [ids],
      )) as Array<{ item_uid: string; attribute_name: string }>
      const appliedIds = new Set(rows.filter(row => row.attribute_name === 'applied').map(row => row.item_uid))
      const hideIds = new Set(rows.filter(row => row.attribute_name === 'hide').map(row => row.item_uid))
      const favIds = new Set(rows.filter(row => row.attribute_name === 'fav').map(row => row.item_uid))

      return ads.map(ad => ({
        ...ad,
        applied: appliedIds.has(ad.id),
        hide: hideIds.has(ad.id),
        fav: favIds.has(ad.id),
      }))
    } finally {
      conn.release()
    }
  }

  private async markMeta(itemUid: string, attributeName: string, value: boolean): Promise<void> {
    const conn = await db.getConnection()
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
    const conn = await db.getConnection()
    try {
      await conn.query(`delete from meta where item_uid = ? and attribute_name = ?`, [itemUid, attributeName])
    } finally {
      conn.release()
    }
  }
}
