import { type FC } from 'react'
import { MoviesIcon } from '@repo/assets'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { TablePlaceholder, TorrentSearch } from '@/card-components'
import { useFeed } from '@repo/feed-client'
import { Torrent } from '@repo/types'
import { TopTitlesTable } from './TopTitlesTable'
import { TorrentsLoader } from './TorrentsLoader'
import { TorrentsTableView } from './TorrentsTableView'
import { useTopTitles } from './useTopTitles'
import { useTorrentSearch } from './useTorrentSearch'

export const TopTorrents: FC<Record<string, never>> = () => {
  const zoom = useZoom('the-pirate')
  const feed = useFeed<Torrent[]>('top-torrents')
  const { query, lastQuery, loading, onQuery, onSearch, onClear, onTitleSearch } = useTorrentSearch(feed)
  const topTitles = useTopTitles(feed, lastQuery)
  const topTitlesMode = lastQuery === '' && !loading

  if (feed === undefined) {
    return (
      <ApolloCard cardId='the-pirate' title='Torrenty' icon={MoviesIcon} height={4}>
        <TablePlaceholder rows={12} graph={false} value={false} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='the-pirate' title='Torrenty' icon={MoviesIcon} height={4}>
      <div>
        <div>
          {zoom ? <TorrentSearch query={query} onQuery={onQuery} onSearch={onSearch} onClear={onClear} /> : null}
        </div>
        {topTitlesMode ? (
          <TopTitlesTable topTitles={topTitles} onTitleSearch={onTitleSearch} />
        ) : loading ? (
          <TorrentsLoader />
        ) : (
          <TorrentsTableView torrents={feed} zoom={zoom} />
        )}
      </div>
    </ApolloCard>
  )
}
