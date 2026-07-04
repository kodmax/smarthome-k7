import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { MoviesIcon } from '@repo/assets'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import {
  ApolloDataTable,
  ApolloTableCell,
  ApolloTableRow,
  Copy,
  TablePlaceholder,
  TorrentSearch,
} from '@/card-components'
import { useFeed } from '@repo/feed-client'
import { designTokens } from '@repo/design-tokens'
import styled from '@emotion/styled'
import { Torrent } from '@repo/types'

const cardTableFontSize = designTokens.font.body.size

const TorrentsTable = styled(ApolloDataTable)({
  tableLayout: 'fixed',
  fontSize: cardTableFontSize,
})

export const TopTorrents: FC<Record<string, never>> = () => {
  const feed = useFeed<Torrent[]>('top-torrents')

  if (feed === undefined) {
    return (
      <ApolloCard cardId='the-pirate' title='Torrenty' icon={MoviesIcon} height={4}>
        <TablePlaceholder rows={12} graph={false} value={false} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='the-pirate' title='Torrenty' icon={MoviesIcon} height={4}>
      <ZoomContext.Consumer>
        {zoom => (
          <div>
            <div>{zoom.active ? <TorrentSearch /> : null}</div>
            <TorrentsTable>
              <TableBody>
                {feed.map(torrent => (
                  <ApolloTableRow key={torrent.info_hash}>
                    {!zoom.active ? null : (
                      <>
                        <ApolloTableCell sx={{ width: '1.5em' }}>
                          <Copy
                            text={`magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`}
                          />
                        </ApolloTableCell>
                        {zoom.active ? (
                          <ApolloTableCell data-no-close sx={{ width: '5em' }}>
                            S: {torrent.seeders}
                          </ApolloTableCell>
                        ) : null}
                        <ApolloTableCell sx={{ width: '4rem', textAlign: 'right', paddingRight: '0.5em' }}>
                          {Number(+torrent.size / 2 ** 30).toFixed(1)} GB
                        </ApolloTableCell>
                      </>
                    )}
                    <ApolloTableCell sx={{ textAlign: 'left' }}>{torrent.name}</ApolloTableCell>
                    {zoom.active ? (
                      <>
                        <ApolloTableCell data-no-close sx={{ width: '4em' }}>
                          <a href={`https://www.imdb.com/title/${torrent.imdb}/`}>Imdb</a>
                        </ApolloTableCell>
                        <ApolloTableCell data-no-close sx={{ width: '15em', fontSize: 5 }}>
                          {`magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`}
                        </ApolloTableCell>
                      </>
                    ) : null}
                  </ApolloTableRow>
                ))}
              </TableBody>
            </TorrentsTable>
          </div>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
