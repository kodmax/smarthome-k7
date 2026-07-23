import { JobMarketHybridWorkIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const HybridWorkModeSplit: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='hybrid-work-mode-split'
      icon={JobMarketHybridWorkIcon}
      title={t.jobMarket.summary.hybridWorkModeSplit}
      value={feed?.hybridWorkPercent.value}
      previous={feed?.hybridWorkPercent.previous}
      variant='percent'
    />
  )
}
