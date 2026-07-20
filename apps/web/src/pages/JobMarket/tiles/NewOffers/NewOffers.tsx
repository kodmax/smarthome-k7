import { JobMarketNewOffersIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const NewOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-new-offers'
      icon={JobMarketNewOffersIcon}
      title={t.jobMarket.summary.newOffers}
      value={feed?.newOffersCount.value}
      previous={feed?.newOffersCount.previous}
      variant='count'
    />
  )
}
