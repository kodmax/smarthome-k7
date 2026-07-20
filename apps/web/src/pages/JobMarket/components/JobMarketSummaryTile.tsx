import { Typography } from '@mui/material'
import { type StyledLucideIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { getChangeTone } from '../formatJobMarketChange'

export type JobMarketSummaryTileProps = {
  cardId: string
  icon: StyledLucideIcon
  title: string
  value: string
  change?: string
  changeValue?: number
  comparisonLabel?: string
}

const changeToneColor = (tone: ReturnType<typeof getChangeTone>): string => {
  switch (tone) {
    case 'positive':
      return 'success.main'
    case 'negative':
      return 'error.main'
    default:
      return 'text.secondary'
  }
}

export const JobMarketSummaryTile: FC<JobMarketSummaryTileProps> = ({
  cardId,
  icon,
  title,
  value,
  change,
  changeValue = 0,
  comparisonLabel,
}) => (
  <ApolloCard cardId={cardId} title={title} icon={icon} height={3} allowZoom={false}>
    <Typography
      sx={{
        fontSize: designTokens.font.h1.size,
        fontWeight: designTokens.font.h1.weight,
        lineHeight: designTokens.font.h1.lineHeight,
        mb: change === undefined ? 0 : 0.75,
      }}
    >
      {value}
    </Typography>

    {change !== undefined && (
      <>
        <Typography
          variant='body2'
          sx={{ color: changeToneColor(getChangeTone(changeValue)), fontWeight: 600, mb: 0.5 }}
        >
          {change}
        </Typography>

        {comparisonLabel !== undefined && (
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            {comparisonLabel}
          </Typography>
        )}
      </>
    )}
  </ApolloCard>
)
