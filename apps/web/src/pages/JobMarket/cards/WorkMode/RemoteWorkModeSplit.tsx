import { GlobeIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const RemoteWorkModeSplit: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-work-mode-split'
      icon={GlobeIcon}
      title={t.jobMarket.summary.remoteWorkModeSplit}
      value={feed?.remoteWorkPercent.value}
      previous={feed?.remoteWorkPercent.previous}
      variant='percent'
    />
  )
}
