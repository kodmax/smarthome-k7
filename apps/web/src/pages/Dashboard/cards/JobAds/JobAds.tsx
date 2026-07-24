import { type FC, useMemo } from 'react'
import { JobAdsIcon } from '@repo/assets'
import { BaseCard, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { TableEmptyMessage, TablePlaceholder } from '@/card-components'
import { JobAdsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { JobAdsList } from './ad'
import { filterVisibleJobAds } from './visibleJobAds'

export const JobAds: FC<Record<string, never>> = () => {
  const zoom = useZoom('job-ads')
  const feed = useFeed<JobAdsFeed>('job-ads')
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds

  const visibleAds = useMemo(() => (feed ? filterVisibleJobAds(feed.ads) : []), [feed])

  const headingInfo = useMemo(() => {
    if (!feed) {
      return undefined
    }

    return visibleAds.length
  }, [feed, visibleAds.length])

  return (
    <BaseCard cardId='job-ads' title={labels.title} icon={JobAdsIcon} height={6} headingInfo={headingInfo}>
      {!feed ? (
        <TablePlaceholder rows={12} graph={true} value={true} />
      ) : visibleAds.length === 0 ? (
        <TableEmptyMessage>{t.dashboard.common.emptyMessage}</TableEmptyMessage>
      ) : (
        <JobAdsList ads={visibleAds} zoom={zoom} />
      )}
    </BaseCard>
  )
}

export default JobAds
