import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { AirQualityIcon } from '@repo/assets'
import { Allergen } from './Allergen'
import { ApolloCard } from '@/apollo-card'
import { ApolloDataTable, TablePlaceholder } from '@/card-components'
import { useFeed } from '@repo/feed-client'
import { AllergensFeed } from '@repo/types'

export const Allergens: FC<Record<string, never>> = () => {
  const feed = useFeed<AllergensFeed>('weather')

  return (
    <ApolloCard cardId='allergens' title='Alergeny' icon={AirQualityIcon} height={5}>
      {!feed ? (
        <TablePlaceholder rows={5} graph={false} value={true} />
      ) : (
        <ApolloDataTable>
          <TableBody>
            {feed.allergens.map(allergen => (
              <Allergen key={allergen.id} data={allergen} />
            ))}
          </TableBody>
        </ApolloDataTable>
      )}
    </ApolloCard>
  )
}
