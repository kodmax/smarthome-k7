import { IconButton } from '@mui/material'
import { Download } from 'lucide-react'
import { type FC } from 'react'
import { Torrent } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell, ApolloTableRow, ApolloValueCell, Copy } from '@/card-components'
import { useTranslations } from '@/i18n'

const iconSize = designTokens.icon.sizeXs - 4

const magnetLink = (torrent: Torrent) =>
  `magnet:?xt=urn:btih:${torrent.info_hash}&dn=${encodeURIComponent(torrent.name)}`

type TorrentRowProps = {
  torrent: Torrent
  zoom: boolean
  onDownload: (magnetLink: string) => void
}

export const TorrentRow: FC<TorrentRowProps> = ({ torrent, zoom, onDownload }) => {
  const { t } = useTranslations()
  const downloadLabel = `${t.dashboard.torrents.download} ${torrent.name}`

  return (
    <ApolloTableRow>
      {!zoom ? null : (
        <>
          <ApolloTableCell sx={{ width: '1.5em' }}>
            <Copy text={magnetLink(torrent)} />
          </ApolloTableCell>
          <ApolloTableCell sx={{ width: '5em' }}>S: {torrent.seeders}</ApolloTableCell>
          <ApolloValueCell sx={{ width: `${designTokens.space[16]}px`, paddingRight: '0.5em' }}>
            {Number(+torrent.size / 2 ** 30).toFixed(1)} GB
          </ApolloValueCell>
        </>
      )}
      <ApolloTableCell>{torrent.name}</ApolloTableCell>
      <ApolloTableCell sx={{ width: '2.5em' }}>
        <IconButton aria-label={downloadLabel} onClick={() => onDownload(magnetLink(torrent))} size='small'>
          <Download size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
        </IconButton>
      </ApolloTableCell>
    </ApolloTableRow>
  )
}
