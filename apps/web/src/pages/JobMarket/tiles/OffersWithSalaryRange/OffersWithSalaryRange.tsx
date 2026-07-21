import { JobMarketSalaryRangeIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const OffersWithSalaryRange: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-offers-with-salary-range'
      icon={JobMarketSalaryRangeIcon}
      title={t.jobMarket.summary.offersWithSalaryRange}
      value={feed?.offersWithSalaryRangePercent.value}
      previous={feed?.offersWithSalaryRangePercent.previous}
      variant='percent'
    />
  )
}
