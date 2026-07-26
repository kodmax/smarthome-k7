import { TableBody } from '@mui/material'
import { FC } from 'react'
import { ApolloDataTable } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobAdsFeedItem } from '@repo/types'
import { Ad } from './Ad'

const cardTableFontSize = designTokens.font.body.size

type Props = {
  ads: JobAdsFeedItem[]
  zoom: boolean
}

export const JobAdsList: FC<Props> = ({ ads, zoom }) => {
  return (
    <ApolloDataTable style={{ fontSize: cardTableFontSize, tableLayout: 'fixed', width: '100%' }}>
      <TableBody>
        {ads.map(ad => (
          <Ad key={ad.content.id} ad={ad} zoom={zoom} />
        ))}
      </TableBody>
    </ApolloDataTable>
  )
}
