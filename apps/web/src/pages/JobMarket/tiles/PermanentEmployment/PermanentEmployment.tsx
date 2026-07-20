import { FileTextIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const PermanentEmployment: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-permanent-employment'
      icon={FileTextIcon}
      title={labels.permanentEmployment}
      value={feed !== undefined ? `${feed.permanentEmploymentPercent}%` : '--'}
      change='-2 pp'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
