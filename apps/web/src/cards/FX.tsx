import { type FC, useEffect } from 'react'
import { feed, useUpdate } from '@repo/feed-client'
import banner from './card-banners/fx.jpg'
import { Graph } from './components/Graph'
import ApolloCard, { ZoomContext } from '../apollo-card/ApolloCard'
import TablePlaceholder from './components/TablePlaceholder'

const zoomListener: EventListener = (ev: Event) => {
    const { cardId } = (ev as CustomEvent<{ cardId: string }>).detail
    if (cardId === 'fx') {
        feed.dispatchEvent(new CustomEvent('request-feeds-refresh', { detail: ['fx'] }))
    }
}

const moreFx = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'EUR/UAH', 'GBP/PLN', 'PLN/UAH', 'PLN/RUB']
const mainFx = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'EUR/UAH']

export const FX: FC<Record<string, never>> = () => {
    const [fx, updatedAt] = useUpdate<any>('fx')

    useEffect(() => {
        feed.addEventListener('card-zoom', zoomListener)
        return () => {
            feed.removeEventListener('card-zoom', zoomListener)
        }
    }, [])

    return (
        <ApolloCard cardId='fx' banner={banner} updatedAt={updatedAt}>
            <ZoomContext.Consumer>
                { zoom => !fx ? (<TablePlaceholder rows={4} graph={true} value={true} />) : (
                    <table className='apollo-data-table'>
                        <tbody>
                            {(zoom.active ? moreFx : mainFx).filter(pair => pair in fx.rates).map(pair => {
                                return (
                                    <tr key={pair}>
                                        <td>{pair}</td>
                                        <td style={{ padding: 0, width: '4em' }}>
                                            <Graph scaleX={30} scaleY={fx.rates[pair] / 10} data={fx.history[pair]} />
                                        </td>
                                        { zoom.active
                                            ? <td>{Number(fx.rates[pair]).toFixed(2)} ({Number(1 / fx.rates[pair]).toFixed(4)})</td>
                                            : <td>{Number(fx.rates[pair]).toFixed(2)}</td>
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </ZoomContext.Consumer>
        </ApolloCard>
    )
}
