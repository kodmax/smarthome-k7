import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { EnergyIcon } from '@repo/assets'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, KnxReading, Reading, TablePlaceholder } from '@/card-components'
import { EnergyFeed } from '@repo/types'

export const Energy: FC<Record<string, never>> = () => {
  const feed = useFeed<EnergyFeed>('energy')

  const onZoom = useCallback(() => {
    refreshFeeds(['energy', 'home.power-draw', 'home.energy-consumption.today'])
  }, [])

  if (feed === undefined) {
    return (
      <ApolloCard cardId='energy' title='Energia' icon={EnergyIcon}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const grossPrice = +feed.cost.rates.distribution + +feed.cost.rates.energy * feed.cost.rates.vat
  const cost = (feed.meter.reading.value / 1000) * grossPrice
  const meterReading = feed.total.adjusted / 1000

  const avgMonthlyConsumption = (feed.cost.avg * 30) / 1000
  const avgMonthlyCost =
    (avgMonthlyConsumption * (+feed.cost.rates.distribution + +feed.cost.rates.energy) + feed.cost.rates.added) *
    feed.cost.rates.vat

  return (
    <ApolloCard cardId='energy' title='Energia' icon={EnergyIcon} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !feed ? (
            <TablePlaceholder rows={4} graph={false} value={true} />
          ) : (
            <ApolloDataTable>
              <TableBody>
                <KnxReading
                  feed={feed.daily}
                  label='Zużycie dziś'
                  formatValue={r => Number(r.value).toLocaleString('en-PL', { maximumFractionDigits: 2 })}
                  bars={{ historyKey: 'today', highest: 1000, valueKey: 'hourly_consumption' }}
                />
                {!zoom.active ? null : (
                  <>
                    <Reading
                      title='Stan licznika'
                      copy={Number(meterReading).toFixed(2).replace('.', ',')}
                      displayValue={Number(meterReading).toLocaleString('en-PL', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                      unit='kWh'
                    />
                    <Reading
                      title='Cena brutto'
                      copy={Number(grossPrice).toFixed(4).replace('.', ',')}
                      displayValue={Number(grossPrice).toLocaleString('en-PL', {
                        maximumFractionDigits: 4,
                        minimumFractionDigits: 4,
                      })}
                      unit='zł/kWh'
                    />
                    <KnxReading feed={feed.meter} label='Meter energy' />
                    <Reading title='Meter cost' displayValue={Number(cost).toFixed(4).replace('.', ',')} unit='PLN' />
                  </>
                )}
                {zoom.active ? null : (
                  <>
                    <Reading
                      title='Śr. zużycie msc'
                      displayValue={Number(avgMonthlyConsumption).toFixed(0)}
                      unit='kWh'
                    />
                    <Reading title='Śr. koszt za msc' displayValue={Number(avgMonthlyCost).toFixed(0)} unit='zł' />
                  </>
                )}
                <KnxReading
                  feed={feed.instant}
                  label='Chwilowy pobór'
                  range={{ optimal: 400, lowest: 100, highest: 2400 }}
                  formatValue={r => Number(r.value).toLocaleString('en-PL', { maximumFractionDigits: 0 })}
                />
              </TableBody>
            </ApolloDataTable>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
