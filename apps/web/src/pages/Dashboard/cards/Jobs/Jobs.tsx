import { TableBody } from '@mui/material'
import { type FC, useCallback, useEffect, useState } from 'react'
import { JobsIcon, SettingsIcon } from '@repo/assets'
import { ApolloCard, ApolloCardAction, useZoom } from '@repo/apollo-card'
import { useCommand, useFeed } from '@repo/feed-client'
import { ApolloDataTable, TableEmptyMessage, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobsFeed } from '@repo/types'
import { Ad } from './Ad'

const cardTableFontSize = designTokens.font.body.size

export const Jobs: FC<Record<string, never>> = () => {
  const [editMode, setEditMode] = useState<boolean>(false)

  const zoom = useZoom('jobs')
  const feed = useFeed<JobsFeed>('jobs')
  const applied = useCommand('jobs', 'applied')
  const hide = useCommand('jobs', 'hide')
  const restore = useCommand('jobs', 'restore')
  const fav = useCommand('jobs', 'fav')
  const unfav = useCommand('jobs', 'unfav')

  const onAppliedJob = useCallback(
    (id: string) => {
      applied(id)
    },
    [applied],
  )

  const onHideJob = useCallback(
    (id: string) => {
      hide(id)
    },
    [hide],
  )

  const onRestoreJob = useCallback(
    (id: string) => {
      restore(id)
    },
    [restore],
  )

  const onFavJob = useCallback(
    (id: string) => {
      fav(id)
    },
    [fav],
  )

  const onUnfavJob = useCallback(
    (id: string) => {
      unfav(id)
    },
    [unfav],
  )

  const onEditPreferences = useCallback(() => {
    setEditMode(!editMode)
  }, [editMode])

  useEffect(() => {
    if (!zoom) {
      setEditMode(false)
    }
  }, [zoom])

  const ads = feed?.ads.filter(ad => !ad.hide || editMode) ?? []

  return (
    <ApolloCard
      cardId='jobs'
      title='Oferty pracy'
      icon={JobsIcon}
      height={6}
      headingInfo={feed?.ads.filter(ad => !ad.hide).length}
      actions={<ApolloCardAction title='Edit preferences' onClick={onEditPreferences} Icon={SettingsIcon} />}
    >
      {!feed ? (
        <TablePlaceholder rows={12} graph={true} value={true} />
      ) : ads.length === 0 ? (
        <TableEmptyMessage>Na razie nie ma tu nic nowego</TableEmptyMessage>
      ) : (
        <ApolloDataTable style={{ fontSize: cardTableFontSize, tableLayout: 'fixed', width: '100%' }}>
          <TableBody>
            {ads.map(ad => (
              <Ad
                key={ad.id}
                ad={ad}
                zoom={zoom}
                editMode={editMode}
                onApplied={onAppliedJob}
                onHide={onHideJob}
                onRestore={onRestoreJob}
                onFav={onFavJob}
                onUnfav={onUnfavJob}
              />
            ))}
          </TableBody>
        </ApolloDataTable>
      )}
    </ApolloCard>
  )
}

export default Jobs
