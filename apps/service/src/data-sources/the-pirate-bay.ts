import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { myFetch } from '../fetch'
import { Torrent } from '@repo/types'

export const source: DataSourceDefinition<Torrent[]> = {
  cron: '0 3 * * *',
  id: 'torrents',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 12,
  script: async () => {
    return await myFetch('https://apibay.org/precompiled/data_top100_207.json').then(async resp =>
      JSON.parse(resp.toString()),
    )
  },

  push: (push, command) => {
    command.on('search', args => {
      myFetch(`https://apibay.org/q.php?q=${encodeURIComponent(args)}&cat=207`).then(async resp => {
        const results = JSON.parse(resp.toString())
        push(results)
      })
    })
  },
}
