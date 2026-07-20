import { JobMarketActiveOffersIcon } from '@repo/assets'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const ActiveOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary

  return (
    <JobMarketSummaryTile
      cardId='job-market-active-offers'
      icon={JobMarketActiveOffersIcon}
      title={labels.activeOffers}
      value='2 842'
      change='+256 (9,95%)'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
