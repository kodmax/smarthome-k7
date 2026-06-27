import { Feeds } from '@repo/apollo-ws'
import { DPT_Value_Temp } from 'js-knx'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { temp } from '../home.knx-schema'
import { KnxConnection } from './knx-connection'

export const addHomeTempBedroomFeed = (feeds: Feeds, knx: KnxConnection): void => {
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
}
