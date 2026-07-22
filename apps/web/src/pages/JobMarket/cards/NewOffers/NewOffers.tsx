import { JobMarketNewOffersIcon } from '@repo/assets'
import { JobMarketMetricCard } from '../../components/JobMarketMetricCard'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

export const NewOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketMetricCard
      cardId='job-market-new-offers'
      icon={JobMarketNewOffersIcon}
      title={t.jobMarket.summary.newOffers}
      value={feed?.newOffersCount.value}
      previous={feed?.newOffersCount.previous}
      variant='count'
    />
  )
}
