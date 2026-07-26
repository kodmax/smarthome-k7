import { JobAdsFeedItem, JobApplyStatus } from '@repo/types'
import { FC } from 'react'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell, ApolloTableRow } from '@/card-components'
import { ApplicationStatusEditor } from './ApplicationStatusEditor'

export const AdExpandedEditorRow: FC<{
  ad: JobAdsFeedItem
  columnCount: number
  onSave: (applyStatus: JobApplyStatus, comment: string) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
  onAnalyzeCvMatch: (id: string) => void
}> = ({ ad, columnCount, onSave, onFav, onUnfav, onAnalyzeCvMatch }) => (
  <ApolloTableRow sx={{ height: 'auto' }}>
    <ApolloTableCell
      colSpan={columnCount}
      sx={{
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'clip',
        py: `${designTokens.space[1]}px`,
      }}
    >
      <ApplicationStatusEditor
        ad={ad}
        onSave={onSave}
        onFav={onFav}
        onUnfav={onUnfav}
        onAnalyzeCvMatch={onAnalyzeCvMatch}
      />
    </ApolloTableCell>
  </ApolloTableRow>
)
