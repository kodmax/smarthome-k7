import { Feeds } from '@repo/apollo-ws'
import { DPT_Value_Temp, type KnxLink } from 'js-knx'
import { indoorTempHistory } from '../data-sources'
import knxTemp from '../data-sources/knx/temp'
import { temp } from '../home.knx-schema'

export const addHomeTempLivingroomFeed = (feeds: Feeds, knx: KnxLink): void => {
  feeds.addFeed(
    'home.temp.livingroom',
    {
      dining: knxTemp('temp.livingroom', knx.getDatapoint(temp['Jadalnia'])),
      setpoint: knxTemp('temp.livingroom.setpoint', knx.getDatapoint({ address: '2/0/0', DataType: DPT_Value_Temp })),
      indoorTempHistory,
    },
    ({ dining, indoorTempHistory, setpoint }) => ({
      history: indoorTempHistory['livingroom'],
      setpoint: setpoint.value.toFixed(1),
      ...dining,
    }),
  )
}
