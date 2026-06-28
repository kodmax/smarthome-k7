import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { fetchDocument } from '@/fetch'
import { Article, NewsFeed } from '@repo/types'
import { config } from '../config'

const FEED_URL =
  'https://news.google.com/topics/CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE/sections/CAQiTkNCSVNORG9JYkc5allXeGZkakpDRUd4dlkyRnNYM1l5WDNObFkzUnBiMjV5Q2hJSUwyMHZNRGd4YlY5NkNnb0lMMjB2TURneGJWOG9BQSowCAAqLAgKIiZDQklTRmpvSWJHOWpZV3hmZGpKNkNnb0lMMjB2TURneGJWOG9BQVABUAE?hl=pl&gl=PL&ceid=PL%3Apl'
const COOKIES = `SOCS=${config.google.socs_cookie}`

export const source: DataSourceDefinition<NewsFeed> = {
  cron: '*/15 * * * *',
  id: 'news',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,
  script: async () => {
    const news = await fetchDocument(FEED_URL, { accept: 'text/html', cookie: COOKIES }).then(document => {
      const articles: Article[] = Array.from(document.querySelectorAll('a[href^="./read"][aria-label]')).map(anchor => {
        return {
          href: new URL(anchor.getAttribute('href') ?? '', 'https://news.google.com').toString(),
          title: anchor.textContent ?? '',
        }
      })

      return {
        articles,
      }
    })

    return news
  },
}
