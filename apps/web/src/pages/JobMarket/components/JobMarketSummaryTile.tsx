import { Typography } from '@mui/material'
import { type StyledLucideIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'

export type JobMarketSummaryTileProps = {
  cardId: string
  icon: StyledLucideIcon
  title: string
  value: string
  change: string
  comparisonLabel: string
}

export const JobMarketSummaryTile: FC<JobMarketSummaryTileProps> = ({
  cardId,
  icon,
  title,
  value,
  change,
  comparisonLabel,
}) => (
  <ApolloCard cardId={cardId} title={title} icon={icon} height={3} allowZoom={false}>
    <Typography
      sx={{
        fontSize: designTokens.font.h1.size,
        fontWeight: designTokens.font.h1.weight,
        lineHeight: designTokens.font.h1.lineHeight,
        mb: 0.75,
      }}
    >
      {value}
    </Typography>

    <Typography variant='body2' sx={{ color: 'success.main', fontWeight: 600, mb: 0.5 }}>
      {change}
    </Typography>

    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
      {comparisonLabel}
    </Typography>
  </ApolloCard>
)
