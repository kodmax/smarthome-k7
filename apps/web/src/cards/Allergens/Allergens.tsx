import { type FC } from 'react'
import zoomBanner from './card-banners/pollen-zoom.jpg'
import banner from './card-banners/pollen.jpg'
import { Allergen } from './Allergen'
import { ApolloCard } from '@/apollo-card'
import TablePlaceholder from '../components/TablePlaceholder'
import { useFeed } from '@repo/feed-client'
import { AllergensFeed } from '@repo/types'

export const Allergens: FC<Record<string, never>> = () => {
  const feed = useFeed<AllergensFeed>('weather')

  return (
    <ApolloCard cardId='allergens' banner={banner} zoomBanner={zoomBanner} height={5}>
      {!feed ? (
        <TablePlaceholder rows={5} graph={false} value={true} />
      ) : (
        <table className='apollo-data-table'>
          <tbody>
            {feed.allergens.map(allergen => (
              <Allergen key={allergen.id} data={allergen} />
            ))}
          </tbody>
        </table>
      )}
    </ApolloCard>
  )
}
