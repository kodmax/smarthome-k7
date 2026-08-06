import { createHash } from 'node:crypto'
import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { Inject } from '@/di'
import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { Article, NewsCachedFeed, NewsFeed } from '@repo/types'
import type { config as AppConfig } from '../config'
import type { Sql } from '@repo/db'

const META_RETENTION_DAYS = 30

const FEED_URL =
  'https://news.google.com/topics/CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE/sections/CAQiTkNCSVNORG9JYkc5allXeGZkakpDRUd4dlkyRnNYM1l5WDNObFkzUnBiMjV5Q2hJSUwyMHZNRGd4YlY5NkNnb0lMMjB2TURneGJWOG9BQSowCAAqLAgKIiZDQklTRmpvSWJHOWpZV3hmZGpKNkNnb0lMMjB2TURneGJWOG9BQVABUAE?hl=pl&gl=PL&ceid=PL%3Apl'

export class NewsSource extends DataSource<NewsFeed, NewsCachedFeed> {
  @Inject('db')
  declare private db: Sql

  @Inject('config')
  declare private config: typeof AppConfig

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'read':
        await this.read(args)
        break
      case 'unread':
        await this.unread(args)
        break
    }
  }

  public async read(itemUid: string): Promise<void> {
    await this.markMeta(itemUid, 'read', true)
    void this.push()
  }

  public async unread(itemUid: string): Promise<void> {
    await this.unmarkMeta(itemUid, 'read')
    void this.push()
  }

  static getId() {
    return 'news'
  }

  static getCron() {
    return '*/15 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.MINUTE * 5
  }

  protected getSourceMetricType() {
    return 'scraper' as const
  }

  protected async fetchData() {
    return {
      articles: await this.fetchArticles(),
    }
  }

  protected async composeContent(cached: NewsCachedFeed): Promise<NewsFeed> {
    return {
      articles: await this.withMetaState(cached.articles),
    }
  }

  public async maintenance() {
    await observeDbQuery(
      'delete',
      'meta',
      () =>
        this.db`
        delete from meta
        where group_id = ${this.getId()}
          and last_update_timestamp < now() - ${`${META_RETENTION_DAYS} days`}::interval
      `,
    )
  }

  private async fetchArticles(): Promise<NewsCachedFeed['articles']> {
    const document = await observeHttpFetch(FEED_URL, 'html', () =>
      fetchDocument(FEED_URL, {
        accept: 'text/html',
        cookie: `SOCS=${this.config.google.socs_cookie}`,
      }),
    )

    return Array.from(document.querySelectorAll('a[href^="./read"][aria-label]')).map(anchor => {
      const href = new URL(anchor.getAttribute('href') ?? '', 'https://news.google.com').toString()
      const title = anchor.textContent ?? ''

      return {
        href,
        uid: this.digestTitle(title),
        title,
      }
    })
  }

  private async withMetaState(articles: NewsCachedFeed['articles']): Promise<Article[]> {
    if (articles.length === 0) {
      return []
    }

    const uids = articles.map(article => article.uid)
    const rows = await observeDbQuery(
      'select',
      'meta',
      () =>
        this.db<Array<{ item_uid: string; attribute_name: string }>>`
        select item_uid, attribute_name from meta
        where group_id = ${this.getId()}
          and attribute_name = 'read'
          and item_uid in ${this.db(uids)}
          and value = ${this.db.json(true)}
      `,
    )
    const readUids = new Set(rows.map(row => row.item_uid))

    return articles.map(article => ({
      ...article,
      read: readUids.has(article.uid),
    }))
  }

  private async markMeta(itemUid: string, attributeName: string, value: boolean): Promise<void> {
    await observeDbQuery(
      'insert',
      'meta',
      () =>
        this.db`
        insert into meta (item_uid, attribute_name, group_id, value)
        values (${itemUid}, ${attributeName}, ${this.getId()}, ${this.db.json(value)})
        on conflict (item_uid, attribute_name) do update set
          value = excluded.value,
          group_id = excluded.group_id
      `,
    )
  }

  private async unmarkMeta(itemUid: string, attributeName: string): Promise<void> {
    await observeDbQuery(
      'delete',
      'meta',
      () =>
        this.db`
        delete from meta
        where group_id = ${this.getId()} and item_uid = ${itemUid} and attribute_name = ${attributeName}
      `,
    )
  }

  private digestTitle(title: string): string {
    return createHash('sha256').update(title).digest('hex')
  }
}
