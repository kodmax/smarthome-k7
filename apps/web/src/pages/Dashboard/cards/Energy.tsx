import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { EnergyIcon } from '@repo/assets'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { ApolloDataTable, KnxReading, Reading, TablePlaceholder } from '@/card-components'
import { EnergyFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { shouldShowHighDrawHint } from './Energy/highDrawHint'
import { indicatorRed } from './components/colorForValueInRange'

const { icon } = designTokens

export const Energy: FC<Record<string, never>> = () => {
  const zoom = useZoom('energy')
  const feed = useFeed<EnergyFeed>('energy')
  const { t } = useTranslations()
  const labels = t.dashboard.energy

  const onZoom = useCallback(() => {
    refreshFeeds(['energy', 'home.power-draw', 'home.energy-consumption.today'])
  }, [])

  if (feed === undefined) {
    return (
      <ApolloCard cardId='energy' title={labels.title} icon={EnergyIcon}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const grossPrice = (feed.cost.rates.distribution + feed.cost.rates.energy) * feed.cost.rates.vat
  const cost = (feed.meter.reading.value / 1000) * grossPrice

  const avgDailyConsumption = feed.cost.avg / 1000
  const avgMonthlyConsumption = (feed.cost.avg * 30) / 1000
  const avgMonthlyCost =
    (avgMonthlyConsumption * (+feed.cost.rates.distribution + +feed.cost.rates.energy) + feed.cost.rates.added) *
    feed.cost.rates.vat

  return (
    <ApolloCard
      cardId='energy'
      title={labels.title}
      icon={EnergyIcon}
      onZoom={onZoom}
      headingInfo={
        shouldShowHighDrawHint(feed.instant.reading.value) ? (
          <EnergyIcon
            size={icon.sizeSm}
            strokeWidth={icon.strokeWidth}
            color={indicatorRed}
            glow='default'
            aria-label={labels.highDraw}
          />
        ) : undefined
      }
    >
      {!feed ? (
        <TablePlaceholder rows={4} graph={false} value={true} />
      ) : (
        <ApolloDataTable>
          <TableBody>
            <KnxReading
              feed={feed.daily}
              label={labels.consumptionToday}
              formatValue={r => Number(r.value).toLocaleString('en-PL', { maximumFractionDigits: 2 })}
              bars={{ historyKey: 'today', highest: 1000, valueKey: 'hourly_consumption' }}
            />
            {!zoom ? null : (
              <>
                <Reading
                  title={labels.avgDailyConsumption}
                  displayValue={Number(avgDailyConsumption).toLocaleString('en-PL', { maximumFractionDigits: 1 })}
                  unit='kWh'
                />
                <Reading
                  title={labels.grossPrice}
                  copy={Number(grossPrice).toFixed(4).replace('.', ',')}
                  displayValue={Number(grossPrice).toLocaleString('en-PL', {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 4,
                  })}
                  unit='zł/kWh'
                />
                <Reading
                  title={labels.fixedFee}
                  displayValue={Number(feed.cost.rates.added * feed.cost.rates.vat)
                    .toFixed(2)
                    .replace('.', ',')}
                  unit='PLN'
                />
                <KnxReading feed={feed.meter} label={labels.reading} />
                <Reading title={labels.cost} displayValue={Number(cost).toFixed(4).replace('.', ',')} unit='PLN' />
              </>
            )}
            {zoom ? null : (
              <>
                <Reading
                  title={labels.avgMonthlyConsumption}
                  displayValue={Number(avgMonthlyConsumption).toFixed(0)}
                  unit='kWh'
                />
                <Reading title={labels.avgMonthlyCost} displayValue={Number(avgMonthlyCost).toFixed(0)} unit='zł' />
              </>
            )}
            <KnxReading
              feed={feed.instant}
              label={labels.instantDraw}
              range={{ optimal: 400, lowest: 100, highest: 2400 }}
              formatValue={r => Number(r.value).toLocaleString('en-PL', { maximumFractionDigits: 0 })}
            />
          </TableBody>
        </ApolloDataTable>
      )}
    </ApolloCard>
  )
}
