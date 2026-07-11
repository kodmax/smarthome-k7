import { DPT_StartStop, KnxLink } from 'js-knx'
import { config } from '../src/config'

const main = async () => {
  const knx = new KnxLink(config.knx.host)
  await knx.connect()
  console.log('KNX connection established.')

  const start = knx.group({
    address: '5/2/1',
    DataType: DPT_StartStop,
  })

  // const stop = knx.group({
  //   DataType: DPT_StartStop,
  //   address: '5/2/4',
  // })

  // const reset = knx.group({
  //   DataType: DPT_StartStop,
  //   address: '5/2/6'
  // })

  // const reading = knx.group({
  //   DataType: DPT_ActiveEnergy,
  //   address: '5/2/2',
  // })

  // await stop.write(1)
  await start.write(1)
  await start.write(1)
  // await reading.requestValue()

  await knx.disconnect()
}

main()
