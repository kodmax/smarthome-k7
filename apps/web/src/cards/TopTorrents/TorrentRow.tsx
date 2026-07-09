import { IconButton } from '@mui/material'
import { Download } from 'lucide-react'
import { type FC } from 'react'
import { Torrent } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell, ApolloTableRow, ApolloValueCell, Copy } from '@/card-components'

const iconSize = designTokens.icon.sizeXs - 4

const magnetLink = (torrent: Torrent) =>
  `magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`

type TorrentRowProps = {
  torrent: Torrent
  zoom: boolean
  onDownload: (magnetLink: string) => void
}

export const TorrentRow: FC<TorrentRowProps> = ({ torrent, zoom, onDownload }) => (
  <ApolloTableRow>
    {!zoom ? null : (
      <>
        <ApolloTableCell sx={{ width: '1.5em' }}>
          <Copy text={magnetLink(torrent)} />
        </ApolloTableCell>
        <ApolloTableCell sx={{ width: '5em' }}>S: {torrent.seeders}</ApolloTableCell>
        <ApolloValueCell sx={{ width: '4rem', paddingRight: '0.5em' }}>
          {Number(+torrent.size / 2 ** 30).toFixed(1)} GB
        </ApolloValueCell>
      </>
    )}
    <ApolloTableCell>{torrent.name}</ApolloTableCell>
    <ApolloTableCell sx={{ width: '2.5em' }}>
      <IconButton
        aria-label={`Download ${torrent.name}`}
        onClick={() => onDownload(magnetLink(torrent))}
        size='small'
      >
        <Download size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
      </IconButton>
    </ApolloTableCell>
  </ApolloTableRow>
)
