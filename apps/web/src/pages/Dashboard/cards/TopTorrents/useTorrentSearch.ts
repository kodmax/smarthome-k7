import { Torrent } from '@repo/types'
import { useCommand } from '@repo/feed-client'
import { useCallback, useEffect, useState } from 'react'

export const useTorrentSearch = (feed: Torrent[] | undefined) => {
  const [query, setQuery] = useState('')
  const [lastQuery, setLastQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const search = useCommand('torrents', 'search')

  const runSearch = useCallback(
    (searchQuery: string) => {
      search(searchQuery)
      setLastQuery(searchQuery)
      setLoading(true)
    },
    [search],
  )

  const onQuery = useCallback((value: string) => {
    setQuery(value)
  }, [])

  const onSearch = useCallback(() => {
    runSearch(query)
  }, [query, runSearch])

  const onClear = useCallback(() => {
    setQuery('')
    runSearch('')
  }, [runSearch])

  const onTitleSearch = useCallback(
    (title: string) => {
      setQuery(title)
      runSearch(title)
    },
    [runSearch],
  )

  useEffect(() => {
    setLoading(current => (current ? false : current))
  }, [feed])

  return {
    query,
    lastQuery,
    loading,
    onQuery,
    onSearch,
    onClear,
    onTitleSearch,
  }
}
