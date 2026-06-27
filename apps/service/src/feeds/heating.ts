import { Feeds } from '@repo/apollo-ws'
import { TemperatureData } from '@repo/types'
import type { KnxLink } from 'js-knx'
import knxB1 from '../data-sources/knx/b1'
import KnxHVACMode from '../data-sources/knx/hvac-mode'
import { knxSchema } from '../home.knx-schema'

export const addHeatingFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.heating
  const heatersReadings = {
    bathroomState: knxB1('home.heating.lazienka.water-heating', knx.getDatapoint(schema.bathroom.waterHeating)),
    bathroomFloorState: knxB1('home.heating.lazienka.floor-heating', knx.getDatapoint(schema.bathroom.floorHeating)),
    livingRoomState: knxB1('home.heating.salon.water-heating', knx.getDatapoint(schema.livingRoom.waterHeating)),
    bedroomState: knxB1('home.heating.sypialnia.water-heating', knx.getDatapoint(schema.bedroom.waterHeating)),
  }

  const hvacModes = {
    livingroomMode: KnxHVACMode('home.heating.hvacmode.living-room', knx.getDatapoint(schema.livingRoom.hvacMode)),
    bathroomMode: KnxHVACMode('home.heating.hvacmode.bathroom', knx.getDatapoint(schema.bathroom.hvacMode)),
    bedroomMode: KnxHVACMode('home.heating.hvacmode.bedroom', knx.getDatapoint(schema.bedroom.hvacMode)),
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
