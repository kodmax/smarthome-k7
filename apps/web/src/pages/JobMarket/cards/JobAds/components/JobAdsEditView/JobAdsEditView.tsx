import { JobAdsFeedItem } from '@repo/types'
import { FC, useCallback, useMemo, useState } from 'react'
import { TableEmptyMessage } from '@/card-components'
import { useCommand } from '@repo/feed-client'
import { useTranslations } from '@/i18n'
import {
  type JobAdsFilter,
  filterJobAdsByAppliedAt,
  filterJobAdsByCategory,
  filterJobAdsByRequiredSkills,
  groupArchivedJobAdsByReason,
} from '../../jobAdsFilter'
import { JobAdsArchivedAdList } from './JobAdsArchivedAdList'
import type { JobAdsChangeStatePayload } from '@repo/types'
import { JobAdsEditAdList } from './JobAdsEditAdList'

type Props = {
  ads: JobAdsFeedItem[] | undefined
  filter: JobAdsFilter
  skillsFilter?: string[]
  onlyAppliedArchived?: boolean
}

export const JobAdsEditView: FC<Props> = ({ ads, filter, skillsFilter = [], onlyAppliedArchived = false }) => {
  const { t } = useTranslations()
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null)

  const changeState = useCommand('job-ads', 'change-state')
  const fav = useCommand('job-ads', 'fav')
  const unfav = useCommand('job-ads', 'unfav')
  const analyzeCvMatch = useCommand('job-ads', 'analyze-cv-match')

  const filteredAds = useMemo(() => {
    const byStatus = filterJobAdsByCategory(ads ?? [], filter)
    const bySkills = filterJobAdsByRequiredSkills(byStatus, skillsFilter)
    return filter === 'archived' && onlyAppliedArchived ? filterJobAdsByAppliedAt(bySkills, true) : bySkills
  }, [ads, filter, skillsFilter, onlyAppliedArchived])
  const archivedGroups = useMemo(
    () => (filter === 'archived' ? groupArchivedJobAdsByReason(filteredAds) : null),
    [filter, filteredAds],
  )

  const onChangeApplicationState = useCallback(
    ({ id, applyStatus, archiveReason, comment }: JobAdsChangeStatePayload) => {
      changeState({
        id,
        applyStatus,
        archiveReason,
        comment: comment || undefined,
      })
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

  return filter === 'archived' && archivedGroups !== null ? (
    <JobAdsArchivedAdList
      groups={archivedGroups}
      expandedAdId={expandedAdId}
      onToggleExpand={onToggleExpand}
      onChangeApplicationState={onChangeApplicationState}
      onFav={fav}
      onUnfav={unfav}
      onAnalyzeCvMatch={analyzeCvMatch}
    />
  ) : (
    <JobAdsEditAdList
      ads={filteredAds}
      expandedAdId={expandedAdId}
      onToggleExpand={onToggleExpand}
      onChangeApplicationState={onChangeApplicationState}
      onFav={fav}
      onUnfav={unfav}
      onAnalyzeCvMatch={analyzeCvMatch}
    />
  )
}

export function countJobAdsEditViewAds(
  ads: JobAdsFeedItem[] | undefined,
  filter: JobAdsFilter,
  skillsFilter: string[] = [],
  onlyAppliedArchived = false,
): number {
  const byStatus = filterJobAdsByCategory(ads ?? [], filter)
  const bySkills = filterJobAdsByRequiredSkills(byStatus, skillsFilter)
  const filtered = filter === 'archived' && onlyAppliedArchived ? filterJobAdsByAppliedAt(bySkills, true) : bySkills
  return filtered.length
}
