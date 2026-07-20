import { JobMarketNewOffersIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { formatNumber } from '@/helpers/formatNumber'
import { useTranslations } from '@/i18n'

export const NewOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <JobMarketSummaryTile
      cardId='job-market-new-offers'
      icon={JobMarketNewOffersIcon}
      title={labels.newOffers}
      value={feed !== undefined ? formatNumber(feed.newOffersCount, { fractionDigits: 0 }) : '--'}
      change='+83 (15,7%)'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
