import { JobMarketSalaryRangeIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const OffersWithSalaryRange: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-offers-with-salary-range'
      icon={JobMarketSalaryRangeIcon}
      title={t.jobMarket.summary.offersWithSalaryRange}
      value={feed?.offersWithSalaryRangePercent.value}
      previous={feed?.offersWithSalaryRangePercent.previous}
      variant='percent'
    />
  )
}
