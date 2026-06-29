import { type FC, useCallback } from 'react'
import zoomBanner from './card-banners/electricity-zoom.jpg'
import banner from './card-banners/electricity.jpg'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, ColorIndicator, Copy, HoursBars, TablePlaceholder } from '@/card-components'
import { EnergyFeed } from '@repo/types'

export const Energy: FC<Record<string, never>> = () => {
  const feed = useFeed<EnergyFeed>('energy')

  const onZoom = useCallback(() => {
    refreshFeeds(['energy', 'home.power-draw', 'home.energy-consumption.today'])
  }, [])

  if (feed === undefined) {
    return (
      <ApolloCard cardId='energy' banner={banner} zoomBanner={zoomBanner}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const grossPrice = +feed.cost.rates.distribution + +feed.cost.rates.energy * feed.cost.rates.vat
  const cost = (feed.meter.value / 1000) * grossPrice
  const meterReading = feed.total.adjusted / 1000

  const avgMonthlyConsumption = (feed.cost.avg * 30) / 1000
  const avgMonthlyCost =
    (avgMonthlyConsumption * (+feed.cost.rates.distribution + +feed.cost.rates.energy) + feed.cost.rates.added) *
    feed.cost.rates.vat

  return (
    <ApolloCard cardId='energy' banner={banner} zoomBanner={zoomBanner} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !feed ? (
            <TablePlaceholder rows={4} graph={false} value={true} />
          ) : (
            <ApolloDataTable>
              <tbody>
                <tr>
                  <td>Zużycie dziś</td>
                  <td style={{ padding: 0, width: '4em' }}>
                    <HoursBars data={feed.today.bars} highest={1000} valueKey='hourly_consumption' />
                  </td>
                  <td>{Number(feed.today.value / 1000).toLocaleString('en-PL', { maximumFractionDigits: 2 })} kWh</td>
                </tr>
                {!zoom.active ? null : (
                  <>
                    <tr>
                      <td>Stan licznika</td>
                      <td></td>
                      <td>
                        <Copy text={Number(meterReading).toFixed(2).replace('.', ',')} />
                        {Number(meterReading).toLocaleString('en-PL', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{' '}
                        kWh
                      </td>
                    </tr>
                    <tr>
                      <td>Cena brutto</td>
                      <td></td>
                      <td>
                        <Copy text={Number(grossPrice).toFixed(4).replace('.', ',')} />
                        {Number(grossPrice).toLocaleString('en-PL', {
                          maximumFractionDigits: 4,
                          minimumFractionDigits: 4,
                        })}{' '}
                        zł/kWh
                      </td>
                    </tr>
                    <tr>
                      <td>Meter energy</td>
                      <td></td>
                      <td>{feed.meter.text}</td>
                    </tr>
                    <tr>
                      <td>Meter cost</td>
                      <td></td>
                      <td>{Number(cost).toFixed(4).replace('.', ',')} PLN</td>
                    </tr>
                  </>
                )}
                {zoom.active ? null : (
                  <>
                    <tr>
                      <td>Śr. zużycie msc</td>
                      <td></td>
                      <td>{Number(avgMonthlyConsumption).toFixed(0)} kWh</td>
                    </tr>
                    <tr>
                      <td>Śr. koszt za msc</td>
                      <td></td>
                      <td>{Number(avgMonthlyCost).toFixed(0)} zł</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td>Chwilowy pobór</td>
                  <td></td>
                  <td>
                    <ColorIndicator instant={feed.instant.value} range={{ optimal: 400, lowest: 100, highest: 2400 }} />
                    {Number(feed.instant.value).toLocaleString('en-PL', { maximumFractionDigits: 0 })} W
                  </td>
                </tr>
              </tbody>
            </ApolloDataTable>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
