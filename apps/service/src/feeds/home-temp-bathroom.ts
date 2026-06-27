import { Feeds } from '@repo/apollo-ws'
import { DPT_Value_Temp } from 'js-knx'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { temp } from '../home.knx-schema'
import { KnxConnection } from './knx-connection'

export const addHomeTempBathroomFeed = (feeds: Feeds, knx: KnxConnection): void => {
  feeds.addFeed(
    'home.temp.bathroom',
    {
      bathroom: knxTemp('temp.bathroom', knx.getDatapoint(temp.Lazienka)),
      setpoint: knxTemp('temp.bathroom.setpoint', knx.getDatapoint({ address: '2/1/0', DataType: DPT_Value_Temp })),
      indoorTempHistory,
    },
    ({ bathroom, indoorTempHistory, setpoint }) => ({
      history: indoorTempHistory['bathroom'],
      setpoint: setpoint.value.toFixed(1),
      ...bathroom,
    }),
  )
}
