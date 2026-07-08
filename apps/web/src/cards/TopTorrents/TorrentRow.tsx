import { type FC } from 'react'
import { Torrent } from '@repo/types'
import { ApolloTableCell, ApolloTableRow, Copy } from '@/card-components'

const magnetLink = (torrent: Torrent) =>
  `magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`

type TorrentRowProps = {
  torrent: Torrent
  zoom: boolean
}

export const TorrentRow: FC<TorrentRowProps> = ({ torrent, zoom }) => (
  <ApolloTableRow>
    {!zoom ? null : (
      <>
        <ApolloTableCell sx={{ width: '1.5em' }}>
          <Copy text={magnetLink(torrent)} />
        </ApolloTableCell>
        <ApolloTableCell sx={{ width: '5em' }}>S: {torrent.seeders}</ApolloTableCell>
        <ApolloTableCell sx={{ width: '4rem', textAlign: 'right', paddingRight: '0.5em' }}>
          {Number(+torrent.size / 2 ** 30).toFixed(1)} GB
        </ApolloTableCell>
      </>
    )}
    <ApolloTableCell sx={{ textAlign: 'left !important' }}>{torrent.name}</ApolloTableCell>
    {!zoom ? null : <ApolloTableCell sx={{ width: '15em', fontSize: 5 }}>{magnetLink(torrent)}</ApolloTableCell>}
  </ApolloTableRow>
)
