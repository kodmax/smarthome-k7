#!/usr/bin/ts-node
import { configDotenv } from 'dotenv'

process.setMaxListeners(100)
configDotenv()

import { torrents, weather, energyCost, energyConsumption, co2Hourly, indoorTempHistory } from './data-sources'
import { Server, Cache, sysLog, Feeds } from 'apollo-ws'
import { DPT_Alarm, DPT_HVACMode, DPT_Value_Temp, KnxLink } from 'js-knx'
import path from 'path'

import { energy, airQuality, temp, heating } from './home.knx-schema'
import KnxHVACMode from './data-sources/knx/hvac-mode'
import knxHumidity from './data-sources/knx/humidity'
import knxSwitch from './data-sources/knx/switch'
import knxEnergy from './data-sources/knx/energy'
import knxPower from './data-sources/knx/power'
import knxTemp from './data-sources/knx/temp'
import knxCo2 from './data-sources/knx/co2'
import { EventEmitter } from 'node:events'
import { KnxEventEmitter } from 'js-knx/dist/connection/link/LinkOptions'
import { EnergyReading } from '@repo/types'

Server.listen({}, async apollo => {
  const feeds = new Feeds(new Cache(path.join(__dirname, '/data-sources/.cache')), apollo.vent)
  const knxEvents: KnxEventEmitter = new EventEmitter()
  knxEvents.setMaxListeners(100)
  
  knxEvents.on('error', e => {
    console.error(e)
  })
  sysLog(apollo.vent, 6)

  // feeds.addFeed('irs', { irs })
  // feeds.addFeed('fuel', { fuel })
  feeds.addFeed('weather', { weather })
  // feeds.addFeed('news', { news })
  // feeds.addFeed('fx', { fx })

  console.log('Establishing KNX connection ...')
  await KnxLink.connect('192.168.1.8', { events: knxEvents }).then(async knx => {
    console.log('KNX connection established.')
    process.on('SIGTERM', () => {
      knx.disconnect().then(() => process.exit(0))
      console.log('SIGTERM. Exiting.')
    })

    const heatersReadings = {
      bathroomState: knxSwitch(
        'home.heating.lazienka.water-heating',
        knx.getDatapoint(heating['Grzejniki wodne']['Lazienka stan']),
      ),
      bathroomFloorState: knxSwitch(
        'home.heating.lazienka.floor-heating',
        knx.getDatapoint(heating['Podłoga Łazienka'].state),
      ),
      livingRoomState: knxSwitch(
        'home.heating.salon.water-heating',
        knx.getDatapoint(heating['Grzejniki wodne']['Salon stan']),
      ),
      bedroomState: knxSwitch(
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
        'home.heating.hvacmode.living-room',
        knx.getDatapoint({ DataType: DPT_HVACMode, address: '2/1/4' }),
      ),
      bedroomMode: KnxHVACMode(
        'home.heating.hvacmode.living-room',
        knx.getDatapoint({ DataType: DPT_HVACMode, address: '2/2/4' }),
      ),
    }
    feeds.addFeed('heating', { ...heatersReadings, ...hvacModes }, readings => ({
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
    }))

    const energyReadings = {
      total: knxEnergy('home.energy-consumption.meter-total-reading', knx.getDatapoint(energy.Total.reading)),
      instant: knxPower('home.power-draw', knx.getDatapoint(energy.InstantPowerDraw.reading)),
      meter: knxEnergy('energy.meter', knx.getDatapoint(energy['Intermediate Consumption Meter'].Reading)),
    }

    feeds.addFeed(
      'energy',
      { energyCost, energyConsumption, ...energyReadings },
      ({ energyCost, total, instant, energyConsumption, meter }): EnergyReading => ({
        total: { ...total, adjusted: total.value + 12307130 + 181000 },
        today: {
          value: total.value - energyConsumption.startOfDayValue,
          bars: energyConsumption.bars,
        },
        cost: energyCost,
        instant,
        meter,
      }),
    )

    const co2Level = knxCo2('home.air-quality.co2', knx.getDatapoint(airQuality.CO2.reading))
    const co2Alert = knxSwitch(
      'home.air-quality.co2-alert',
      knx.getDatapoint({ address: '2/5/1', DataType: DPT_Alarm }),
    )
    feeds.addFeed('home.air-quality.co2', { co2Hourly, co2Level, co2Alert }, ({ co2Level, co2Hourly, co2Alert }) => {
      return {
        alert: co2Alert,
        ...co2Level,
        ...co2Hourly,
      }
    })

    feeds.addFeed('home.air-quality.humidity', {
      humidityReading: knxHumidity('home.air-quality.humidity', knx.getDatapoint(airQuality.Wilgotność.reading)),
    })

    feeds.addFeed(
      'home.temp.bathroom-floor',
      {
        bathroomFloor: knxTemp('temp.bathroom-floor', knx.getDatapoint(temp['Podloga lazienka temperatura'])),
        indoorTempHistory,
      },
      ({ bathroomFloor, indoorTempHistory }) => ({
        history: indoorTempHistory['bathroomFloor'],
        ...bathroomFloor,
      }),
    )

    feeds.addFeed(
      'home.temp.bedroom',
      {
        bedroomHal: knxTemp('temp.bedroom', knx.getDatapoint(temp['Sypialnia hol'])),
        setpoint: knxTemp('temp.bedroom.setpoint', knx.getDatapoint({ address: '2/2/0', DataType: DPT_Value_Temp })),
        indoorTempHistory,
      },
      ({ bedroomHal, indoorTempHistory, setpoint }) => ({
        history: indoorTempHistory['bedroom'],
        setpoint: setpoint.value.toFixed(1),
        ...bedroomHal,
      }),
    )

    feeds.addFeed(
      'home.temp.livingroom',
      {
        dining: knxTemp('temp.livingroom', knx.getDatapoint(temp['Jadalnia'])),
        setpoint: knxTemp('temp.bedroom.setpoint', knx.getDatapoint({ address: '2/0/0', DataType: DPT_Value_Temp })),
        indoorTempHistory,
      },
      ({ dining, indoorTempHistory, setpoint }) => ({
        history: indoorTempHistory['livingroom'],
        setpoint: setpoint.value.toFixed(1),
        ...dining,
      }),
    )

    feeds.addFeed(
      'home.temp.bathroom',
      {
        bathroom: knxTemp('temp.bathroom', knx.getDatapoint(temp.Lazienka)),
        setpoint: knxTemp('temp.bedroom.setpoint', knx.getDatapoint({ address: '2/1/0', DataType: DPT_Value_Temp })),
        indoorTempHistory,
      },
      ({ bathroom, indoorTempHistory, setpoint }) => ({
        history: indoorTempHistory['bathroom'],
        setpoint: setpoint.value.toFixed(1),
        ...bathroom,
      }),
    )
  })

  // feeds.addFeed('jobs', { jobs }, ({ jobs }) => {
  //     return jobs
  // })

  feeds.addFeed('top-torrents', { torrents })

  // feeds.addFeed('commodities', { commodities, fx }, ({ commodities, fx: { rates } }) => {
  //     const er = Number(rates['USD/PLN'])
  //     return {
  //         oil: {
  //             'PLN/l': Number(+commodities.oil.l * er).toFixed(2),
  //             history: commodities.oil.history
  //         },
  //         ng: {
  //             'PLN/GJ': Number(+commodities.ng.GJ * er).toFixed(0),
  //             history: commodities.ng.history
  //         },
  //         coal: {
  //             'PLN/MT': Number(+commodities.coal.ton * er).toFixed(0),
  //             history: commodities.coal.history
  //         },
  //         gold: {
  //             'PLN/g': Number(+commodities.gold.g * er).toFixed(0),
  //             history: commodities.gold.history
  //         },
  //         btc: {
  //             'BTC/USD': Number(commodities.btc.usd).toFixed(0),
  //             history: commodities.btc.history
  //         },
  //         inflation: {
  //             history: commodities.inflation
  //         }
  //     }
  // })
})
