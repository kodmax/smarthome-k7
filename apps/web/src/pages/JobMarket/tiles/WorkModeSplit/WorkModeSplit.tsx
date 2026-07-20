import { GlobeIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const WorkModeSplit: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-work-mode-split'
      icon={GlobeIcon}
      title={t.jobMarket.summary.workModeSplit}
      value={feed?.remoteWorkPercent.value}
      previous={feed?.remoteWorkPercent.previous}
      variant='percent'
    />
  )
}
