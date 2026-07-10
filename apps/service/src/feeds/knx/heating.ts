import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { TemperatureData } from '@repo/types'
import type { KnxLink } from 'js-knx'
import knxB1 from '@/data-sources/knx/b1'
import KnxHVACMode from '@/data-sources/knx/hvac-mode'

export const addHeatingFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.heating
  const heatersReadings = {
    bathroomState: knxB1('home.heating.lazienka.water-heating', knx.group(schema.bathroom.waterHeating)),
    bathroomFloorState: knxB1('home.heating.lazienka.floor-heating', knx.group(schema.bathroom.floorHeating)),
    livingRoomState: knxB1('home.heating.salon.water-heating', knx.group(schema.livingRoom.waterHeating)),
    bedroomState: knxB1('home.heating.sypialnia.water-heating', knx.group(schema.bedroom.waterHeating)),
  }

  const hvacModes = {
    livingroomMode: KnxHVACMode('home.heating.hvacmode.living-room', knx.group(schema.livingRoom.hvacMode)),
    bathroomMode: KnxHVACMode('home.heating.hvacmode.bathroom', knx.group(schema.bathroom.hvacMode)),
    bedroomMode: KnxHVACMode('home.heating.hvacmode.bedroom', knx.group(schema.bedroom.hvacMode)),
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
