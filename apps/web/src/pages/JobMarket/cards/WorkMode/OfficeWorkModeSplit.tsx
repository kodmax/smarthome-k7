import { JobMarketOfficeWorkIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const OfficeWorkModeSplit: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-office-work-mode-split'
      icon={JobMarketOfficeWorkIcon}
      title={t.jobMarket.summary.officeWorkModeSplit}
      value={feed?.officeWorkPercent.value}
      previous={feed?.officeWorkPercent.previous}
      variant='percent'
    />
  )
}
