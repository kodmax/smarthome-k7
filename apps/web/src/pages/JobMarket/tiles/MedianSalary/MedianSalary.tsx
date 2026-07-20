import { BanknoteIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const MedianSalary: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-median-salary'
      icon={BanknoteIcon}
      title={t.jobMarket.summary.medianSalary}
      value={feed?.medianSalary.value}
      previous={feed?.medianSalary.previous}
      variant='currency'
    />
  )
}
