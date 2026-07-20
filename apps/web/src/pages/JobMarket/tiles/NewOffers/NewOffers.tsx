import { JobMarketNewOffersIcon } from '@repo/assets'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const NewOffers: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary

  return (
    <JobMarketSummaryTile
      cardId='job-market-new-offers'
      icon={JobMarketNewOffersIcon}
      title={labels.newOffers}
      value='612'
      change='+83 (15,7%)'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
