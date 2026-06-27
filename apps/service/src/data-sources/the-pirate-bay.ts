import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { getJSON } from '@/fetch'
import { Torrent } from '@repo/types'

export const source: DataSourceDefinition<Torrent[]> = {
  cron: '0 3 * * *',
  id: 'torrents',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 12,
  script: async () => {
    return await getJSON<Torrent[]>('https://apibay.org/precompiled/data_top100_207.json')
  },

  push: (push, command, err) => {
    command.on('search', (query: string) => {
      getJSON<Torrent[]>(
        query !== ''
          ? `https://apibay.org/q.php?q=${encodeURIComponent(query)}&cat=207`
          : 'https://apibay.org/precompiled/data_top100_207.json',
      )
        .then(torrents => {
          push(torrents)
        })
        .catch(e => {
          err(e instanceof Error ? e : new Error('Unknown torrent search error'))
        })
    })
  },
}
