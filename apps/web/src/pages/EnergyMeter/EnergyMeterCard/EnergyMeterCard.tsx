import { Box, Card, CircularProgress } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import { EnergyFeed } from '@repo/types'
import { CardContent } from './CardContent'

const cardSx = {
  borderRadius: `${designTokens.radius['2xl']}px`,
  p: {
    xs: `${designTokens.layout.paddingMobile}px`,
    md: `${designTokens.layout.paddingTablet}px`,
  },
} as const

export const EnergyMeterCard: FC<Record<string, never>> = () => {
  const feed = useFeed<EnergyFeed>('energy')

  if (feed === undefined) {
    return (
      <Card sx={cardSx}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 420,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={cardSx}>
      <CardContent feed={feed} />
    </Card>
  )
}
