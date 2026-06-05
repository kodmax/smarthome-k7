import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { myFetch } from '../fetch'
import { JSDOM } from 'jsdom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const source: DataSourceDefinition<any> = {
    cron: '*/15 * * * *',
    id: 'news',

    expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,
    script: async () => {
        const url = 'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FuQnNHZ0pRVENnQVAB?hl=pl&gl=PL&ceid=PL:pl'
        const cookie = 'SOCS=CAISNQgLEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjIxMjExLjA5X3AxGgJwbCACGgYIgKTknAY'

        const news = await myFetch(url, { accept: 'text/html', cookie }).then(resp => resp.toString('utf-8')).then(html => {
            const document = new JSDOM(html).window.document
            return Array.from(document.querySelectorAll('article')).filter(article => article.querySelector('figure')).map(article => {
                return {
                    href: new URL(article.querySelector('a[href^="./articles"]')?.getAttribute('href') ?? '', 'https://news.google.com').toString(),
                    title: article.querySelector('h4')?.innerHTML
                }
            })
        })
        
        return news
    }
}
