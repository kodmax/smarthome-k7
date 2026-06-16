import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { myFetch } from '../fetch'
import { Torrent } from '@repo/types'

export const source: DataSourceDefinition<Torrent[]> = {
  cron: '0 3 * * *',
  id: 'torrents',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 12,
  script: async () => {
    return await myFetch('https://apibay.org/precompiled/data_top100_207.json').then(async resp => JSON.parse(resp))
  },

  push: (push, command) => {
    command.on('search', (query: string) => {
      myFetch(
        query !== ''
          ? `https://apibay.org/q.php?q=${encodeURIComponent(query)}&cat=207`
          : 'https://apibay.org/precompiled/data_top100_207.json',
      ).then(async resp => {
        push(JSON.parse(resp))
      })
    })
  },
}
