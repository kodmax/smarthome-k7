import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { Torrent } from '@repo/types'
import { TorrentRow } from './TorrentRow'
import { TorrentsTable } from './styled'

type TorrentsTableViewProps = {
  torrents: Torrent[]
  zoom: boolean
  onDownload: (magnetLink: string) => void
}

export const TorrentsTableView: FC<TorrentsTableViewProps> = ({ torrents, zoom, onDownload }) => (
  <TorrentsTable>
    <TableBody>
      {torrents.map(torrent => (
        <TorrentRow key={torrent.info_hash} torrent={torrent} zoom={zoom} onDownload={onDownload} />
      ))}
    </TableBody>
  </TorrentsTable>
)
