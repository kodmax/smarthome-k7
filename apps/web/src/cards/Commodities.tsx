import zoomBanner from './card-banners/commodities-zoom.jpg'
import banner from './card-banners/commodities.jpg'
import { type FC, useCallback } from 'react'
import { refreshFeeds, useUpdate } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../apollo-card/ApolloCard'
import { Graph } from './components/Graph'
import TablePlaceholder from './components/TablePlaceholder'

type Salaries = {
  median: number
  top20: number
}

type PriceRecord = {
  datetime: string
  amount: number
}

type History = {
  [k in keyof Salaries]: PriceRecord[]
}

interface JobsOffers {
  salaries: Salaries
  history: History
}

export const Commodities: FC<Record<string, never>> = () => {
  const [reading, updatedAt] = useUpdate<any>('commodities')
  const [jobs] = useUpdate<JobsOffers>('jobs')

  const onZoom = useCallback(() => {
    refreshFeeds(['commodities'])
  }, [])

  if (reading === undefined) {
    return (
      <ApolloCard cardId='commodities' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt} height={4} onZoom={onZoom}>
        <TablePlaceholder rows={6} graph={true} value={true} />
      </ApolloCard>
    )
  }

  // const usd = new Intl.NumberFormat('en-PL', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol', maximumFractionDigits: 0 })

  reading.inflationData = reading.inflation.history.slice(-12)
  for (let i = 0, a = 1; i < reading.inflationData.length; i++) {
    reading.inflationData[i].acc = a *= reading.inflationData[i].value / 100
  }

  return (
    <ApolloCard cardId='commodities' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt} height={4}>
      <ZoomContext.Consumer>
        {zoom => !reading ? (<TablePlaceholder rows={6} graph={true} value={true} />) : (
          <table className='apollo-data-table'>
            <tbody>
              <tr>
                <td>Inflacja</td><td style={{ display: zoom.active ? 'initial' : 'none' }}>
                  12 mscy
                </td>
                <td style={{ width: '4em', padding: 0 }}>
                  <Graph scaleX={1 * 365} scaleY={0.05} data={reading.inflationData} valueKey='acc' />
                </td>
                <td>{reading.inflationData.length > 0 ? Number(reading.inflationData.slice(-1)[0].acc * 100 - 100).toFixed(1) : '--'} %</td>
              </tr>
              <tr><td>Węgiel opałowy</td><td style={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</td>
                <td style={{ width: '4em', padding: 0 }}>
                  <Graph scaleX={30} scaleY={reading.coal['PLN/MT'] / 10} data={reading.coal.history} valueKey='price' />
                </td>
                <td>{`${reading.coal['PLN/MT']} zł/t`}</td>
              </tr>
              <tr>
                <td>Ropa naftowa</td><td style={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</td>
                <td style={{ width: '4em', padding: 0 }}>
                  <Graph scaleX={30} scaleY={reading.oil['PLN/l'] / 10} data={reading.oil.history} valueKey='price' />
                </td>
                <td>{`${reading.oil['PLN/l']} zł/ℓ`}</td>
              </tr>
              <tr>
                <td>Gaz ziemny</td><td style={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</td>
                <td style={{ width: '4em', padding: 0 }}>
                  <Graph scaleX={30} scaleY={reading.ng['PLN/GJ'] / 10} data={reading.ng.history} valueKey='price' />
                </td>
                <td>{`${reading.ng['PLN/GJ']} zł/GJ`}</td>
              </tr>
              <tr>
                <td>Złoto</td><td style={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</td>
                <td style={{ width: '4em', padding: 0 }}>
                  <Graph scaleX={30} scaleY={Number(reading.gold['PLN/g']) / 10} data={reading.gold.history} valueKey='price' />
                </td>
                <td>{`${reading.gold['PLN/g']} zł/g`}</td>
              </tr>
              {!jobs ? null : (
                <tr>
                  <td>Salaries</td>
                  <td style={{ display: zoom.active ? 'initial' : 'none' }}>365 dni</td>
                  <td style={{ width: '4em', padding: 0 }}>
                    <Graph scaleX={365} scaleY={10000} data={jobs.history.top20} valueKey='amount' />
                  </td>

                  <td>{(jobs.salaries.top20 / 1000).toFixed(1)} kPLN</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
