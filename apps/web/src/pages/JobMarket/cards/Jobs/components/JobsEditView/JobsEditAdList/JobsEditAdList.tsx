import { TableBody } from '@mui/material'
import { FC } from 'react'
import { ApolloDataTable } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobAdWithMeta, JobApplyStatus } from '@repo/types'
import { Ad } from './Ad'

const cardTableFontSize = designTokens.font.body.size

type Props = {
  ads: JobAdWithMeta[]
  zoom: boolean
  expandedAdId?: string | null
  onToggleExpand?: (id: string) => void
  onChangeApplicationState?: (id: string, applyStatus: JobApplyStatus, comment: string) => void
  onFav?: (id: string) => void
  onUnfav?: (id: string) => void
}

export const JobsEditAdList: FC<Props> = ({
  ads,
  zoom,
  expandedAdId = null,
  onToggleExpand,
  onChangeApplicationState,
  onFav,
  onUnfav,
}) => {
  return (
    <ApolloDataTable style={{ fontSize: cardTableFontSize, tableLayout: 'fixed', width: '100%' }}>
      <TableBody>
        {ads.map(ad => (
          <Ad
            key={ad.id}
            ad={ad}
            zoom={zoom}
            editMode={true}
            expanded={expandedAdId === ad.id}
            onToggleExpand={onToggleExpand ?? (() => undefined)}
            onChangeApplicationState={onChangeApplicationState ?? (() => undefined)}
            onFav={onFav ?? (() => undefined)}
            onUnfav={onUnfav ?? (() => undefined)}
          />
        ))}
      </TableBody>
    </ApolloDataTable>
  )
}
