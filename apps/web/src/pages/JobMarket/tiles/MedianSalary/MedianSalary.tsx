import { BanknoteIcon } from '@repo/assets'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const MedianSalary: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary

  return (
    <JobMarketSummaryTile
      cardId='job-market-median-salary'
      icon={BanknoteIcon}
      title={labels.medianSalary}
      value='28 500 zł'
      change='+1 300 zł (4,8%)'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
