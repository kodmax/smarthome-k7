import { JobMarketActiveOffersIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const ActiveOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-active-offers'
      icon={JobMarketActiveOffersIcon}
      title={t.jobMarket.summary.activeOffers}
      value={feed?.adsCount.value}
      previous={feed?.adsCount.previous}
      variant='count'
    />
  )
}
