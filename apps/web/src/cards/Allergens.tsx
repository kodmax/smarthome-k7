import { type FC } from 'react'
import zoomBanner from './card-banners/pollen-zoom.jpg'
import banner from './card-banners/pollen.jpg'
import { Allergen, type AllergenData } from './components/Allergen'
import ApolloCard from '../apollo-card/ApolloCard'
import TablePlaceholder from './components/TablePlaceholder'
import { useUpdate } from '@repo/feed-client'

export const Allergens: FC<Record<string, never>> = () => {
    const [allergensList, updatedAt] = useUpdate<{ allergens: AllergenData[] }>('weather')

    return (
        <ApolloCard cardId='allergens' banner={banner} updatedAt={updatedAt} zoomBanner={zoomBanner} height={5}>
            { !allergensList ? (<TablePlaceholder rows={5} graph={false} value={true} />) : (
                <table className='apollo-data-table'>
                    <tbody>
                        {allergensList.allergens.map(allergen => (
                            <Allergen key={allergen.id} data={allergen} />
                        ))}
                    </tbody>
                </table>
            )}
        </ApolloCard>
    )
}
