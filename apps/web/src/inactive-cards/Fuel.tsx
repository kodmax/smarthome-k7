import { TableBody } from '@mui/material'
import { HeatingIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, Graph, TablePlaceholder } from '@/card-components'
import { useFeed } from '@repo/feed-client'

import { type FC } from 'react'
import { FuelPricesFeed } from '@repo/types'

export const Fuel: FC<Record<string, never>> = () => {
  const reading = useFeed<FuelPricesFeed>('fuel')

  return (
    <ApolloCard cardId='fuel' title='Paliwa' icon={HeatingIcon}>
      {!reading ? (
        <TablePlaceholder rows={4} graph={true} value={true} />
      ) : (
        <ApolloDataTable>
          <TableBody>
            <ApolloTableRow>
              <ApolloTableCell>Pb 98</ApolloTableCell>
              <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                <Graph data={reading['98'].history} scaleX={30} scaleY={2} valueKey={'price'} />
              </ApolloTableCell>
              <ApolloTableCell>{Number(reading['98'].current).toFixed(2)} zł/ℓ</ApolloTableCell>
            </ApolloTableRow>
            <ApolloTableRow>
              <ApolloTableCell>Pb 95</ApolloTableCell>
              <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                <Graph data={reading['95'].history} scaleX={30} scaleY={2} valueKey={'price'} />
              </ApolloTableCell>
              <ApolloTableCell>{Number(reading['95'].current).toFixed(2)} zł/ℓ</ApolloTableCell>
            </ApolloTableRow>
            <ApolloTableRow>
              <ApolloTableCell>LPG</ApolloTableCell>
              <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                <Graph data={reading.LPG.history} scaleX={30} scaleY={1} valueKey={'price'} />
              </ApolloTableCell>
              <ApolloTableCell>{Number(reading.LPG.current).toFixed(2)} zł/ℓ</ApolloTableCell>
            </ApolloTableRow>
            <ApolloTableRow>
              <ApolloTableCell>ON</ApolloTableCell>
              <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                <Graph data={reading.ON.history} scaleX={30} scaleY={2} valueKey={'price'} />
              </ApolloTableCell>
              <ApolloTableCell>{Number(reading.ON.current).toFixed(2)} zł/ℓ</ApolloTableCell>
            </ApolloTableRow>
          </TableBody>
        </ApolloDataTable>
      )}
    </ApolloCard>
  )
}
