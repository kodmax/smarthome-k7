import { JobMarketSalaryRangeIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const OffersWithSalaryRange: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-offers-with-salary-range'
      icon={JobMarketSalaryRangeIcon}
      title={labels.offersWithSalaryRange}
      value={feed !== undefined ? `${feed.offersWithSalaryRangePercent}%` : '--'}
      change='+5 pp'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
