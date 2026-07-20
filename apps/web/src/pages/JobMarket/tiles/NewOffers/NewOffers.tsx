import { JobMarketNewOffersIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { formatCountChange } from '../../formatJobMarketChange'
import { formatNumber } from '@/helpers/formatNumber'
import { useTranslations } from '@/i18n'

export const NewOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const change = feed?.changes?.newOffersCount

  return (
    <JobMarketSummaryTile
      cardId='job-market-new-offers'
      icon={JobMarketNewOffersIcon}
      title={labels.newOffers}
      value={feed !== undefined ? formatNumber(feed.newOffersCount, { fractionDigits: 0 }) : '--'}
      change={change !== undefined ? formatCountChange(change) : undefined}
      changeValue={change?.absolute}
      comparisonLabel={change !== undefined ? labels.vsPreviousPeriod : undefined}
    />
  )
}
