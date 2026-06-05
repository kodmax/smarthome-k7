import { type FC, useEffect } from 'react'
import zoomBanner from './card-banners/electricity-zoom.jpg'
import banner from './card-banners/electricity.jpg'
import { feed, useUpdate } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../apollo-card/ApolloCard'
import { ColorIndicator } from './components/ColorIndication'
import TablePlaceholder from './components/TablePlaceholder'
import Copy from './components/Copy'
import { HoursBars } from './components/HoursBars'

const zoomListener: EventListener = (ev: Event) => {
    const { cardId } = (ev as CustomEvent<{ cardId: string }>).detail
    if (cardId === 'energy') {
        feed.dispatchEvent(new CustomEvent('request-feeds-refresh', { detail: ['energy', 'home.power-draw', 'home.energy-consumption.today'] }))
    }
}

export const Energy: FC<Record<string, never>> = () => {
    const [reading, updatedAt] = useUpdate<any>('energy')

    useEffect(() => {
        feed.addEventListener('card-zoom', zoomListener)
        return () => {
            feed.removeEventListener('card-zoom', zoomListener)
        }
    }, [])

    if (reading === undefined) {
        return (
            <ApolloCard cardId='energy' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt}>
                <TablePlaceholder rows={4} graph={false} value={true} />
            </ApolloCard>
        )
    }

    const grossPrice = +reading.cost.rates.distribution + +reading.cost.rates.energy * reading.cost.rates.vat
    const cost = reading.meter.value / 1000 * grossPrice
    const meterReading = reading.total.adjusted / 1000

    const avgMonthlyConsumption = reading.cost.avg * 30 / 1000
    const avgMonthlyCost = (avgMonthlyConsumption * (+reading.cost.rates.distribution + +reading.cost.rates.energy) + reading.cost.rates.added) *
    reading.cost.rates.vat

    return (
        <ApolloCard cardId='energy' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt}>
            <ZoomContext.Consumer>
                {zoom => !reading ? (<TablePlaceholder rows={4} graph={false} value={true} />) : (
                    <table className='apollo-data-table'>
                        <tbody>
                            <tr>
                                <td>Zużycie dziś</td>
                                <td style={{ padding: 0, width: '4em' }}>
                                    <HoursBars data={reading.today.bars} positiveMax={1000} valueKey='hourly_consumption' />
                                </td>
                                <td>{Number(reading.today.value / 1000).toLocaleString('en-PL', { maximumFractionDigits: 2 })} kWh</td>
                            </tr>
                            {!zoom.active ? null : (
                                <>
                                    <tr>
                                        <td>Stan licznika</td>
                                        <td></td>
                                        <td>
                                            <Copy text={Number(meterReading).toFixed(2).replace('.', ',')} />
                                            {Number(meterReading).toLocaleString('en-PL', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} kWh
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Cena brutto</td>
                                        <td></td>
                                        <td>
                                            <Copy text={Number((grossPrice)).toFixed(4).replace('.', ',')} />
                                            {Number((grossPrice)).toLocaleString('en-PL', { maximumFractionDigits: 4, minimumFractionDigits: 4 })} zł/kWh
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Meter energy</td>
                                        <td></td>
                                        <td>
                                            {reading.meter.text}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Meter cost</td>
                                        <td></td>
                                        <td>
                                            {Number(cost).toFixed(4).replace('.', ',')} PLN
                                        </td>
                                    </tr>
                                </>
                            )}
                            {zoom.active ? null : (
                                <>
                                    <tr><td>Śr. zużycie msc</td><td></td><td>{Number(avgMonthlyConsumption).toFixed(0)} kWh</td></tr>
                                    <tr><td>Śr. koszt za msc</td><td></td><td>{Number(avgMonthlyCost).toFixed(0)} zł</td></tr>
                                </>
                            )}
                            <tr>
                                <td>Chwilowy pobór</td>
                                <td></td>
                                <td>
                                    <ColorIndicator instant={reading.instant.value} range={{ optimal: 400, lowest: 100, higest: 2400 }} />
                                    {Number(reading.instant.value).toLocaleString('en-PL', { maximumFractionDigits: 0 })} W
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </ZoomContext.Consumer>
        </ApolloCard>
    )
}
