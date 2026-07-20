import { GlobeIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { formatPercentagePointChange } from '../../formatJobMarketChange'
import { useTranslations } from '@/i18n'

export const WorkModeSplit: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const change = feed?.changes?.remoteWorkPercent

  return (
    <JobMarketSummaryTile
      cardId='job-market-work-mode-split'
      icon={GlobeIcon}
      title={labels.workModeSplit}
      value={feed !== undefined ? `${feed.remoteWorkPercent}%` : '--'}
      change={change !== undefined ? formatPercentagePointChange(change) : undefined}
      changeValue={change?.absolute}
      comparisonLabel={change !== undefined ? labels.vsPreviousPeriod : undefined}
    />
  )
}
