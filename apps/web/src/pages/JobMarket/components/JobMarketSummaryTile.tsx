import { Typography } from '@mui/material'
import { type StyledLucideIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import {
  type JobMarketMetricVariant,
  formatMetricChange,
  formatMetricValue,
  getAbsoluteChange,
  getChangeTone,
} from '../formatJobMarketChange'
import { useTranslations } from '@/i18n'

export type JobMarketSummaryTileProps = {
  cardId: string
  icon: StyledLucideIcon
  title: string
  value?: number
  previous?: number | null
  variant: JobMarketMetricVariant
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
  previous,
  variant,
}) => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const hasChange = value !== undefined && previous != null
  const changeAbsolute = hasChange ? getAbsoluteChange(value, previous) : 0

  return (
    <ApolloCard cardId={cardId} title={title} icon={icon} height={4} allowZoom={false}>
      <Typography
        sx={{
          fontSize: designTokens.font.h1.size,
          fontWeight: designTokens.font.h1.weight,
          lineHeight: designTokens.font.h1.lineHeight,
          mb: 3,
        }}
      >
        {value !== undefined ? formatMetricValue(value, variant) : '--'}
      </Typography>

      <Typography
        variant='body2'
        sx={{ color: changeToneColor(getChangeTone(changeAbsolute)), fontWeight: 600, mb: 0.5 }}
      >
        {hasChange ? formatMetricChange(value, previous, variant) : '--'}
      </Typography>

      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
        {labels.vsPreviousPeriod}
      </Typography>
    </ApolloCard>
  )
}
