import { TableBody } from '@mui/material'
import { FC } from 'react'
import { ApolloDataTable } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobAdsFeedItem } from '@repo/types'
import type { ChangeApplicationStatePayload } from './Ad/AdExpandedEditorRow/ApplicationStatusEditor'
import { Ad } from './Ad'

const cardTableFontSize = designTokens.font.body.size

type Props = {
  ads: JobAdsFeedItem[]
  zoom: boolean
  expandedAdId?: string | null
  onToggleExpand?: (id: string) => void
  onChangeApplicationState?: (payload: ChangeApplicationStatePayload) => void
  onFav?: (id: string) => void
  onUnfav?: (id: string) => void
  onAnalyzeCvMatch?: (id: string) => void
  showApplyStatusIndicator?: boolean
}

export const JobAdsEditAdList: FC<Props> = ({
  ads,
  zoom,
  expandedAdId = null,
  onToggleExpand,
  onChangeApplicationState,
  onFav,
  onUnfav,
  onAnalyzeCvMatch,
  showApplyStatusIndicator = true,
}) => {
  return (
    <ApolloDataTable
      style={{
        fontSize: cardTableFontSize,
        tableLayout: 'fixed',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <TableBody>
        {ads.map(ad => (
          <Ad
            key={ad.content.id}
            ad={ad}
            zoom={zoom}
            editMode={true}
            expanded={expandedAdId === ad.content.id}
            onToggleExpand={onToggleExpand ?? (() => undefined)}
            onChangeApplicationState={onChangeApplicationState ?? (() => undefined)}
            onFav={onFav ?? (() => undefined)}
            onUnfav={onUnfav ?? (() => undefined)}
            onAnalyzeCvMatch={onAnalyzeCvMatch ?? (() => undefined)}
            showApplyStatusIndicator={showApplyStatusIndicator}
          />
        ))}
      </TableBody>
    </ApolloDataTable>
  )
}
