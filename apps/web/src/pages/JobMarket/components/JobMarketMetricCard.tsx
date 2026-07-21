import { type StyledLucideIcon } from '@repo/assets'
import { SingleValueCard } from '@repo/apollo-card'
import { type FC } from 'react'
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

export const JobMarketMetricCard: FC<JobMarketMetricCardProps> = ({
  cardId,
  icon,
  title,
  value,
  previous,
  variant,
}) => {
  const { t } = useTranslations()
  const hasChange = value !== undefined && previous != null
  const changeAbsolute = hasChange ? getAbsoluteChange(value, previous) : 0

  return (
    <SingleValueCard
      cardId={cardId}
      icon={icon}
      title={title}
      primary={value !== undefined ? formatMetricValue(value, variant) : '--'}
      secondary={hasChange ? formatMetricChange(value, previous, variant) : '--'}
      secondaryColor={changeToneColor(getChangeTone(changeAbsolute))}
      tertiary={t.jobMarket.summary.vsPreviousPeriod}
    />
  )
}
