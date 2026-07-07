import { createHash } from 'node:crypto'
import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import db from '@/db'
import { fetchDocument } from '@/fetch'
import { Article, NewsFeed } from '@repo/types'
import { config } from '../config'

const FEED_URL =
  'https://news.google.com/topics/CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE/sections/CAQiTkNCSVNORG9JYkc5allXeGZkakpDRUd4dlkyRnNYM1l5WDNObFkzUnBiMjV5Q2hJSUwyMHZNRGd4YlY5NkNnb0lMMjB2TURneGJWOG9BQSowCAAqLAgKIiZDQklTRmpvSWJHOWpZV3hmZGpKNkNnb0lMMjB2TURneGJWOG9BQVABUAE?hl=pl&gl=PL&ceid=PL%3Apl'
const COOKIES = `SOCS=${config.google.socs_cookie}`

export class NewsSource extends DataSourceDefinition<NewsFeed> {
  public async handleCommand(command: string, args: string, recentContent?: NewsFeed): Promise<void> {
    if (command !== 'read') {
      return
    }

    await this.markRead(args)

    if (recentContent === undefined) {
      return
    }

    this.push({
      articles: recentContent.articles.map(article => (article.uid === args ? { ...article, read: true } : article)),
    })
  }

  getId() {
    return 'news'
  }

  getCron() {
    return '*/15 * * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 5
  }

  async getData() {
    return {
      articles: await this.withReadState(await this.fetchArticles()),
    }
  }

  private async fetchArticles(): Promise<Article[]> {
    const document = await fetchDocument(FEED_URL, { accept: 'text/html', cookie: COOKIES })

    return Array.from(document.querySelectorAll('a[href^="./read"][aria-label]')).map(anchor => {
      const href = new URL(anchor.getAttribute('href') ?? '', 'https://news.google.com').toString()

      return {
        href,
        uid: this.digestUrl(href),
        title: anchor.textContent ?? '',
        read: false,
      }
    })
  }

  private async withReadState(articles: Article[]): Promise<Article[]> {
    if (articles.length === 0) {
      return []
    }

    const conn = await db.getConnection()
    try {
      const uids = articles.map(article => article.uid)
      const rows = (await conn.query(
        `select item_uid from meta
         where attribute_name = 'read'
           and item_uid in (?)
           and value = true`,
        [uids],
      )) as Array<{ item_uid: string }>
      const readUids = new Set(rows.map(row => row.item_uid))

      return articles.map(article => (readUids.has(article.uid) ? { ...article, read: true } : article))
    } finally {
      conn.release()
    }
  }

  private async markRead(itemUid: string): Promise<void> {
    const conn = await db.getConnection()
    try {
      await conn.query(
        `insert into meta (item_uid, attribute_name, value)
         values (?, ?, ?)
         on duplicate key update value = values(value)`,
        [itemUid, 'read', true],
      )
    } finally {
      conn.release()
    }
  }

  private digestUrl(url: string): string {
    return createHash('sha256').update(url).digest('hex')
  }
}
