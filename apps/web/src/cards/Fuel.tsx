import banner from './card-banners/fuel.jpg'
import { ApolloCard } from '@/apollo-card'
import { Graph } from './components/Graph'
import TablePlaceholder from './components/TablePlaceholder'
import { useFeed } from '@repo/feed-client'

import { type FC } from 'react'
import { FuelPricesFeed } from '@repo/types'

export const Fuel: FC<Record<string, never>> = () => {
  const reading = useFeed<FuelPricesFeed>('fuel')

  return (
    <ApolloCard cardId='fuel' banner={banner}>
      {!reading ? (
        <TablePlaceholder rows={4} graph={true} value={true} />
      ) : (
        <table className='apollo-data-table'>
          <tbody>
            <tr>
              <td>Pb 98</td>
              <td style={{ width: '4em', padding: 0 }}>
                <Graph data={reading['98'].history} scaleX={30} scaleY={2} valueKey={'price'} />
              </td>
              <td>{Number(reading['98'].current).toFixed(2)} zł/ℓ</td>
            </tr>
            <tr>
              <td>Pb 95</td>
              <td style={{ width: '4em', padding: 0 }}>
                <Graph data={reading['95'].history} scaleX={30} scaleY={2} valueKey={'price'} />
              </td>
              <td>{Number(reading['95'].current).toFixed(2)} zł/ℓ</td>
            </tr>
            <tr>
              <td>LPG</td>
              <td style={{ width: '4em', padding: 0 }}>
                <Graph data={reading.LPG.history} scaleX={30} scaleY={1} valueKey={'price'} />
              </td>
              <td>{Number(reading.LPG.current).toFixed(2)} zł/ℓ</td>
            </tr>
            <tr>
              <td>ON</td>
              <td style={{ width: '4em', padding: 0 }}>
                <Graph data={reading.ON.history} scaleX={30} scaleY={2} valueKey={'price'} />
              </td>
              <td>{Number(reading.ON.current).toFixed(2)} zł/ℓ</td>
            </tr>
          </tbody>
        </table>
      )}
    </ApolloCard>
  )
}
