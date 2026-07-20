import { JobMarketActiveOffersIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { formatCountChange } from '../../formatJobMarketChange'
import { formatNumber } from '@/helpers/formatNumber'
import { useTranslations } from '@/i18n'

export const ActiveOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const change = feed?.changes?.adsCount

  return (
    <JobMarketSummaryTile
      cardId='job-market-active-offers'
      icon={JobMarketActiveOffersIcon}
      title={labels.activeOffers}
      value={feed !== undefined ? formatNumber(feed.adsCount, { fractionDigits: 0 }) : '--'}
      change={change !== undefined ? formatCountChange(change) : undefined}
      changeValue={change?.absolute}
      comparisonLabel={change !== undefined ? labels.vsPreviousPeriod : undefined}
    />
  )
}
