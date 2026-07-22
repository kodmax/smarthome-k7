import { TableBody } from '@mui/material'
import { FC } from 'react'
import { ApolloDataTable } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobAdWithMeta } from '@repo/types'
import { Ad } from './Ad'

const cardTableFontSize = designTokens.font.body.size

type Props = {
  ads: JobAdWithMeta[]
  zoom: boolean
}

export const JobsAdList: FC<Props> = ({ ads, zoom }) => {
  return (
    <ApolloDataTable style={{ fontSize: cardTableFontSize, tableLayout: 'fixed', width: '100%' }}>
      <TableBody>
        {ads.map(ad => (
          <Ad key={ad.id} ad={ad} zoom={zoom} />
        ))}
      </TableBody>
    </ApolloDataTable>
  )
}
