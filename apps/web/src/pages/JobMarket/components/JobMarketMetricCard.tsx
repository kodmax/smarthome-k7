import { type StyledLucideIcon } from '@repo/assets'
import { SingleValueCard } from '@repo/apollo-card'
import { type FC, type ReactNode } from 'react'
import { useTranslations } from '@/i18n'
import {
  type JobMarketMetricVariant,
  formatMetricChange,
  formatMetricValue,
  getAbsoluteChange,
  getChangeTone,
} from '../formatJobMarketMetric'

export type JobMarketMetricCardProps = {
  cardId: string
  icon: StyledLucideIcon
  title: string
  value?: number | null
  previous?: number | null
  variant: JobMarketMetricVariant
  headingInfo?: ReactNode
  showComparison?: boolean
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

export const JobMarketMetricCard: FC<JobMarketMetricCardProps> = ({
  cardId,
  icon,
  title,
  value,
  previous,
  variant,
  headingInfo,
  showComparison = true,
}) => {
  const { t } = useTranslations()
  const hasChange = showComparison && value != null && previous != null
  const changeAbsolute = hasChange ? getAbsoluteChange(value, previous) : 0

  return (
    <SingleValueCard
      cardId={cardId}
      icon={icon}
      title={title}
      primary={value != null ? formatMetricValue(value, variant) : '--'}
      secondary={hasChange ? formatMetricChange(value, previous, variant) : showComparison ? '--' : undefined}
      secondaryColor={changeToneColor(getChangeTone(changeAbsolute))}
      tertiary={showComparison ? t.jobMarket.summary.vsPreviousPeriod : undefined}
      headingInfo={headingInfo}
    />
  )
}
