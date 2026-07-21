import { BanknoteIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const MedianSalary: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-median-salary'
      icon={BanknoteIcon}
      title={t.jobMarket.summary.medianSalary}
      value={feed?.medianSalary.value}
      previous={feed?.medianSalary.previous}
      variant='currency'
    />
  )
}
