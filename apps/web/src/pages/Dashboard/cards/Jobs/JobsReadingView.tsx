import { FC, useMemo } from 'react'
import { TableEmptyMessage } from '@/card-components'
import { JobAdWithMeta } from '@repo/types'
import { useTranslations } from '@/i18n'
import { JobsAdList } from './JobsAdList'
import { filterVisibleJobAds } from './visibleJobAds'

type Props = {
  ads: JobAdWithMeta[] | undefined
  zoom: boolean
}

export const JobsReadingView: FC<Props> = ({ ads, zoom }) => {
  const { t } = useTranslations()
  const visibleAds = useMemo(() => filterVisibleJobAds(ads ?? []), [ads])

  if (visibleAds.length === 0) {
    return <TableEmptyMessage>{t.dashboard.common.emptyMessage}</TableEmptyMessage>
  }

  return <JobsAdList ads={visibleAds} zoom={zoom} editMode={false} />
}

export function countJobsReadingViewAds(ads: JobAdWithMeta[] | undefined): number {
  return filterVisibleJobAds(ads ?? []).length
}
