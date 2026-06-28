import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { EnergyFeed } from '@repo/types'
import { energyCost, energyConsumption } from '@/data-sources'
import knxEnergy from '@/data-sources/knx/energy'
import knxPower from '@/data-sources/knx/power'
import type { KnxLink } from 'js-knx'

const energyMeterOffset = 12307130 + 181000

export const addEnergyFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.energy
  const energyReadings = {
    total: knxEnergy(
      'home.energy-consumption.meter-total-reading',
      knx.getDatapoint(schema.consumption.meterTotalReading),
    ),
    instant: knxPower('home.power-draw', knx.getDatapoint(schema.powerDraw)),
    meter: knxEnergy('energy.meter', knx.getDatapoint(schema.consumption.meter)),
  }

  feeds.addFeed(
    'energy',
    { energyCost, energyConsumption, ...energyReadings },
    ({ energyCost, total, instant, energyConsumption, meter }): EnergyFeed => ({
      total: { ...total, adjusted: total.value + energyMeterOffset },
      today: {
        value: total.value - energyConsumption.startOfDayValue,
        bars: energyConsumption.bars,
      },
      cost: energyCost,
      instant,
      meter,
    }),
  )
}
