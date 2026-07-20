import { BanknoteIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { formatMedianSalaryChange } from '../../formatJobMarketChange'
import { formatNumber } from '@/helpers/formatNumber'
import { useTranslations } from '@/i18n'

export const MedianSalary: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const change = feed?.changes?.medianSalary

  const value =
    feed?.medianSalary !== undefined && feed.medianSalary !== null
      ? `${formatNumber(feed.medianSalary, { fractionDigits: 0 })} zł`
      : '--'

  return (
    <JobMarketSummaryTile
      cardId='job-market-median-salary'
      icon={BanknoteIcon}
      title={labels.medianSalary}
      value={value}
      change={change !== undefined && change !== null ? formatMedianSalaryChange(change) : undefined}
      changeValue={change?.absolute}
      comparisonLabel={change !== undefined && change !== null ? labels.vsPreviousPeriod : undefined}
    />
  )
}
