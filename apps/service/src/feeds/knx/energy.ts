import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { EnergyFeed } from '@repo/types'
import { EnergyCostSource, EnergyHourlySource, EnergyMeterSource } from '@/data-sources'
import knxEnergy from '@/data-sources/knx/energy'
import knxPower from '@/data-sources/knx/power'
import type { KnxLink } from 'js-knx'

const energyMeterOffset = 12307130 + 181000

export const addEnergyFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.energy
  const energyReadings = {
    total: knxEnergy('home.energy-consumption.meter-total-reading', knx.group(schema.consumption.meterTotalReading)),
    instant: knxPower('home.power-draw', knx.group(schema.powerDraw)),
    meter: EnergyMeterSource,
  }

  feeds.addFeed(
    'energy',
    { energyCost: EnergyCostSource, energyConsumption: EnergyHourlySource, ...energyReadings },
    ({ energyCost, total, instant, energyConsumption, meter }): EnergyFeed => ({
      daily: {
        reading: {
          ...total,
          value: (total.value - energyConsumption.startOfDayValue) / 1000,
          unit: 'kWh',
        },
        history: { today: energyConsumption.bars },
      },
      instant: { reading: instant },
      meter: { reading: meter },
      total: {
        reading: total,
        adjusted: total.value + energyMeterOffset,
      },
      cost: energyCost,
    }),
  )
}
