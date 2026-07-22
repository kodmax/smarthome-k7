import { FC, useCallback, useMemo, useState } from 'react'
import { TableEmptyMessage } from '@/card-components'
import { useCommand } from '@repo/feed-client'
import { JobAdWithMeta, JobApplyStatus } from '@repo/types'
import { useTranslations } from '@/i18n'
import { type JobAdsFilter, filterJobAdsByCategory } from '../../jobAdsFilter'
import { JobsEditAdList } from './JobsEditAdList'

type Props = {
  ads: JobAdWithMeta[] | undefined
  zoom: boolean
  filter: JobAdsFilter
}

export const JobsEditView: FC<Props> = ({ ads, zoom, filter }) => {
  const { t } = useTranslations()
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null)

  const changeState = useCommand('jobs', 'change-state')
  const fav = useCommand('jobs', 'fav')
  const unfav = useCommand('jobs', 'unfav')

  const filteredAds = useMemo(() => filterJobAdsByCategory(ads ?? [], filter), [ads, filter])

  const onChangeApplicationState = useCallback(
    (id: string, applyStatus: JobApplyStatus, comment: string) => {
      changeState(JSON.stringify({ id, applyStatus, comment: comment || undefined }))
      setExpandedAdId(null)
    },
    [changeState],
  )

  const onToggleExpand = useCallback((id: string) => {
    setExpandedAdId(current => (current === id ? null : id))
  }, [])

  if (filteredAds.length === 0) {
    return <TableEmptyMessage>{t.dashboard.common.emptyMessage}</TableEmptyMessage>
  }

  return (
    <JobsEditAdList
      ads={filteredAds}
      zoom={zoom}
      expandedAdId={expandedAdId}
      onToggleExpand={onToggleExpand}
      onChangeApplicationState={onChangeApplicationState}
      onFav={fav}
      onUnfav={unfav}
    />
  )
}

export function countJobsEditViewAds(ads: JobAdWithMeta[] | undefined, filter: JobAdsFilter): number {
  return filterJobAdsByCategory(ads ?? [], filter).length
}
