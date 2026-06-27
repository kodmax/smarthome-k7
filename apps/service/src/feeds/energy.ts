import { Feeds } from '@repo/apollo-ws'
import { EnergyFeed } from '@repo/types'
import { energyCost, energyConsumption } from '../data-sources'
import knxEnergy from '../data-sources/knx/energy'
import knxPower from '../data-sources/knx/power'
import { energy } from '../home.knx-schema'
import type { KnxLink } from 'js-knx'

const energyMeterOffset = 12307130 + 181000

export const addEnergyFeed = (feeds: Feeds, knx: KnxLink): void => {
  const energyReadings = {
    total: knxEnergy('home.energy-consumption.meter-total-reading', knx.getDatapoint(energy.Total.reading)),
    instant: knxPower('home.power-draw', knx.getDatapoint(energy.InstantPowerDraw.reading)),
    meter: knxEnergy('energy.meter', knx.getDatapoint(energy['Intermediate Consumption Meter'].Reading)),
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
