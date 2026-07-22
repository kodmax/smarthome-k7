import { FileTextIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const PermanentEmployment: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-permanent-employment'
      icon={FileTextIcon}
      title={t.jobMarket.summary.permanentEmployment}
      value={feed?.permanentEmploymentPercent.value}
      previous={feed?.permanentEmploymentPercent.previous}
      variant='percent'
    />
  )
}
