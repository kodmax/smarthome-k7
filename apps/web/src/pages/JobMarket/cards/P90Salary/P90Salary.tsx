import { TrendUpIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { formatMetricValue } from '../../formatJobMarketMetric'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const P90Salary: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const p90OffersCount = feed?.p90OffersCount.value

  return (
    <JobMarketMetricCard
      cardId='job-market-p90-salary'
      icon={TrendUpIcon}
      title={t.jobMarket.summary.p90Salary}
      value={feed?.p90Salary.value}
      previous={feed?.p90Salary.previous}
      variant='currency'
      headingInfo={p90OffersCount !== undefined ? formatMetricValue(p90OffersCount, 'count') : undefined}
    />
  )
}
