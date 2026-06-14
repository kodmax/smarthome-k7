import { type FC } from 'react'
import zoomBanner from './torrents-zoom.jpg'
import banner from './torrents.jpg'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import TablePlaceholder from '../components/TablePlaceholder'
import Copy from '../components/Copy'
import { useFeed } from '@repo/feed-client'
import { TorrentSearch } from '../components/TorrentSearch'
import { styled } from '@mui/material'
import { Torrent } from '@repo/types'

const Torrents = styled('table')({
  tableLayout: 'fixed',
})

export const TopTorrents: FC<Record<string, never>> = () => {
  const feed = useFeed<Torrent[]>('top-torrents')

  if (feed === undefined) {
    return <TablePlaceholder rows={4} graph={false} value={false} />
  }

  return (
    <ApolloCard cardId='the-pirate' banner={banner} zoomBanner={zoomBanner} height={4}>
      <ZoomContext.Consumer>
        {zoom => (
          <div>
            <div>{zoom.active ? <TorrentSearch /> : null}</div>
            <Torrents
              className='apollo-data-table'
              sx={{
                fontSize: zoom.active ? '0.25em' : '1em',
                '& tr:nth-child(even)': !zoom.active
                  ? void 0
                  : {
                      background: '#ececec',
                    },
              }}
            >
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
            </Torrents>
          </div>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
