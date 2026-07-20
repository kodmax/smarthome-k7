import { GlobeIcon } from '@repo/assets'
import { type FC } from 'react'
import { JobMarketSummaryTile } from '../../components/JobMarketSummaryTile'
import { useTranslations } from '@/i18n'

export const WorkModeSplit: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.summary

  return (
    <JobMarketSummaryTile
      cardId='job-market-work-mode-split'
      icon={GlobeIcon}
      title={labels.workModeSplit}
      value='78%'
      change='+1%'
      comparisonLabel={labels.vsPreviousPeriod}
    />
  )
}
