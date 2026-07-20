import { PieChartIcon } from '@repo/assets'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const OffersWithSalaryRange: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary

  return (
    <JobMarketSummaryTile
      cardId='job-market-offers-with-salary-range'
      icon={PieChartIcon}
      title={labels.offersWithSalaryRange}
      value='68%'
      change='+5 pp'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
