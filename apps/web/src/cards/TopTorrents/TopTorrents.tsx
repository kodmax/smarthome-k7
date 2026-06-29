import { type FC } from 'react'
import zoomBanner from './torrents-zoom.jpg'
import banner from './torrents.jpg'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, Copy, TablePlaceholder, TorrentSearch } from '@/card-components'
import { useFeed } from '@repo/feed-client'
import styled from '@emotion/styled'
import { Torrent } from '@repo/types'

const TorrentsTable = styled(ApolloDataTable)<{ zoomed: boolean }>(({ zoomed }) => ({
  tableLayout: 'fixed',
  fontSize: zoomed ? '0.25em' : '1em',
  ...(zoomed && {
    '& tr:nth-of-type(even)': {
      backgroundColor: '#ececec',
    },
  }),
}))

export const TopTorrents: FC<Record<string, never>> = () => {
  const feed = useFeed<Torrent[]>('top-torrents')

  if (feed === undefined) {
    return (
      <ApolloCard cardId='the-pirate' banner={banner} zoomBanner={zoomBanner} height={4}>
        <TablePlaceholder rows={12} graph={false} value={false} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='the-pirate' banner={banner} zoomBanner={zoomBanner} height={4}>
      <ZoomContext.Consumer>
        {zoom => (
          <div>
            <div>{zoom.active ? <TorrentSearch /> : null}</div>
            <TorrentsTable zoomed={zoom.active}>
              <tbody>
                {feed.map(torrent => (
                  <tr key={torrent.info_hash}>
                    {!zoom.active ? null : (
                      <>
                        <td style={{ width: '1.5em' }}>
                          <Copy
                            text={`magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`}
                          />
                        </td>
                        {zoom.active ? (
                          <>
                            <td data-no-close style={{ width: '4em' }}>
                              S: {torrent.seeders}
                            </td>
                          </>
                        ) : null}
                        <td style={{ width: '2.5rem', textAlign: 'right', paddingRight: '0.5em' }}>
                          {Number(+torrent.size / 2 ** 30).toFixed(1)} GB
                        </td>
                      </>
                    )}
                    <td style={{ textAlign: 'left' }}>{torrent.name}</td>
                    {zoom.active ? (
                      <>
                        <td data-no-close style={{ width: '4em' }}>
                          <a href={`https://www.imdb.com/title/${torrent.imdb}/`}>Imdb</a>
                        </td>
                        <td data-no-close style={{ width: '15em', fontSize: 5 }}>
                          {`magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`}
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </TorrentsTable>
          </div>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
