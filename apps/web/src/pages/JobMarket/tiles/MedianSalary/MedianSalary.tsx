import { BanknoteIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { formatNumber } from '@/helpers/formatNumber'
import { useTranslations } from '@/i18n'

export const MedianSalary: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  const value =
    feed?.medianSalary !== undefined && feed.medianSalary !== null
      ? `${formatNumber(feed.medianSalary, { fractionDigits: 0 })} zł`
      : '--'

  return (
    <JobMarketSummaryTile
      cardId='job-market-median-salary'
      icon={BanknoteIcon}
      title={labels.medianSalary}
      value={value}
      change='+1 300 zł (4,8%)'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
