import { Torrent } from '@repo/types'
import { compareTitle, unifyTitle } from './unifyTitle'

export type TopTitle = {
  title: string
  imdb: string | null
}

export const getTopTitles = (torrents: Torrent[]): TopTitle[] => {
  const titlesByKey = new Map<string, TopTitle>()

  for (const torrent of torrents) {
    const key = compareTitle(torrent.name)
    const existing = titlesByKey.get(key)

    if (existing === undefined) {
      titlesByKey.set(key, {
        title: unifyTitle(torrent.name),
        imdb: torrent.imdb,
      })
      continue
    }

    if (existing.imdb == null && torrent.imdb != null) {
      existing.imdb = torrent.imdb
    }
  }

  return [...titlesByKey.values()]
}
