import { Box } from '@mui/material'
import { type FC } from 'react'
import { CloudDownload, CloudUpload, HardDrive } from 'lucide-react'
import { designTokens } from '@repo/design-tokens'
import { useFeed } from '@repo/feed-client'
import { TransmissionFeed } from '@repo/types'
import { Speed } from './Speed'

const iconSize = designTokens.icon.sizeXs

export const DownloadsInfo: FC<Record<string, never>> = () => {
  const transmission = useFeed<TransmissionFeed>('transmission')

  if (transmission === undefined || transmission.sessionStats.torrentCount <= 0) {
    return null
  }

  const { downloadSpeed, uploadSpeed, torrentCount } = transmission.sessionStats

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
      <Speed icon={CloudDownload} speed={downloadSpeed} direction='down' />
      <Speed icon={CloudUpload} speed={uploadSpeed} direction='up' />
      <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}>
        <HardDrive size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
        <span>{torrentCount}</span>
      </Box>
    </Box>
  )
}
