import { Feeds } from '@repo/apollo-ws'
import { TemperatureData } from '@repo/types'
import { DPT_HVACMode, type KnxLink } from 'js-knx'
import knxB1 from '../data-sources/knx/b1'
import KnxHVACMode from '../data-sources/knx/hvac-mode'
import { heating } from '../home.knx-schema'

export const addHeatingFeed = (feeds: Feeds, knx: KnxLink): void => {
  const heatersReadings = {
    bathroomState: knxB1(
      'home.heating.lazienka.water-heating',
      knx.getDatapoint(heating['Grzejniki wodne']['Lazienka stan']),
    ),
    bathroomFloorState: knxB1(
      'home.heating.lazienka.floor-heating',
      knx.getDatapoint(heating['Podłoga Łazienka'].state),
    ),
    livingRoomState: knxB1(
      'home.heating.salon.water-heating',
      knx.getDatapoint(heating['Grzejniki wodne']['Salon stan']),
    ),
    bedroomState: knxB1(
      'home.heating.sypialnia.water-heating',
      knx.getDatapoint(heating['Grzejniki wodne']['Sypialnia stan']),
    ),
  }

  const hvacModes = {
    livingroomMode: KnxHVACMode(
      'home.heating.hvacmode.living-room',
      knx.getDatapoint({ DataType: DPT_HVACMode, address: '2/0/4' }),
    ),
    bathroomMode: KnxHVACMode(
      'home.heating.hvacmode.bathroom',
      knx.getDatapoint({ DataType: DPT_HVACMode, address: '2/1/4' }),
    ),
    bedroomMode: KnxHVACMode(
      'home.heating.hvacmode.bedroom',
      knx.getDatapoint({ DataType: DPT_HVACMode, address: '2/2/4' }),
    ),
  }

  feeds.addFeed(
    'heating',
    { ...heatersReadings, ...hvacModes },
    (readings): TemperatureData => ({
      status: {
        lazienka: readings.bathroomState,
        lazienkaPodloga: readings.bathroomFloorState,
        sypialnia: readings.bedroomState,
        salon: readings.livingRoomState,
      },
      mode: {
        livingroom: readings.livingroomMode,
        bathroom: readings.bathroomMode,
        bedroom: readings.bedroomMode,
      },
    }),
  )
}
