import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { EnergyFeed } from '@repo/types'
import { DataSourceRegistryType } from '@/data-sources'

const energyMeterOffset = 12307130 + 181000

export const addEnergyFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'energy',
    dataSources.getByIds([
      'energyCost',
      'energyHourlyConsumption',
      'energyMeterTotalReading',
      'energyPowerDraw',
      'energyMeter',
    ]),
    ({ energyCost, energyHourlyConsumption, energyMeterTotalReading, energyPowerDraw, energyMeter }): EnergyFeed => ({
      daily: {
        reading: {
          ...energyMeterTotalReading,
          value: (energyMeterTotalReading.value - energyHourlyConsumption.startOfDayValue) / 1000,
          unit: 'kWh',
        },
        history: { today: energyHourlyConsumption.bars },
      },
      instant: { reading: energyPowerDraw },
      meter: { reading: energyMeter },
      total: {
        reading: energyMeterTotalReading,
        adjusted: energyMeterTotalReading.value + energyMeterOffset,
      },
      cost: energyCost,
    }),
  )
