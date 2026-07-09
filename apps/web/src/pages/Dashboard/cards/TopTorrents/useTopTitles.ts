import { Torrent } from '@repo/types'
import { useMemo, useRef } from 'react'
import { getTopTitles, type TopTitle } from './getTopTitles'

export const useTopTitles = (torrents: Torrent[] | undefined, lastQuery: string): TopTitle[] | undefined => {
  const cachedTitlesRef = useRef<TopTitle[] | undefined>(undefined)

  return useMemo(() => {
    if (torrents === undefined) {
      return undefined
    }

    if (lastQuery === '') {
      cachedTitlesRef.current = getTopTitles(torrents)
    }

    return cachedTitlesRef.current
  }, [lastQuery, torrents])
}
