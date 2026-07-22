import { type FC, useMemo } from 'react'
import { JobsIcon } from '@repo/assets'
import { BaseCard, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { TableEmptyMessage, TablePlaceholder } from '@/card-components'
import { JobsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { JobsAdList } from './ad'
import { filterVisibleJobAds } from './visibleJobAds'

export const Jobs: FC<Record<string, never>> = () => {
  const zoom = useZoom('jobs')
  const feed = useFeed<JobsFeed>('jobs')
  const { t } = useTranslations()
  const labels = t.dashboard.jobs

  const visibleAds = useMemo(() => (feed ? filterVisibleJobAds(feed.ads) : []), [feed])

  const headingInfo = useMemo(() => {
    if (!feed) {
      return undefined
    }

    return visibleAds.length
  }, [feed, visibleAds.length])

  return (
    <BaseCard cardId='jobs' title={labels.title} icon={JobsIcon} height={6} headingInfo={headingInfo}>
      {!feed ? (
        <TablePlaceholder rows={12} graph={true} value={true} />
      ) : visibleAds.length === 0 ? (
        <TableEmptyMessage>{t.dashboard.common.emptyMessage}</TableEmptyMessage>
      ) : (
        <JobsAdList ads={visibleAds} zoom={zoom} />
      )}
    </BaseCard>
  )
}

export default Jobs
