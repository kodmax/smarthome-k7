import { Feeds } from '@repo/apollo-ws'
import type { KnxLink } from 'js-knx'
import { DPT_Value_Temp } from 'js-knx'
import { indoorTempHistory, type TempHistory } from '@/data-sources'
import knxTemp from '@/data-sources/knx/temp'

export type HomeTempRoomSchema = {
  history: keyof TempHistory
  reading: { address: string; DataType: typeof DPT_Value_Temp }
  setpoint?: { address: string; DataType: typeof DPT_Value_Temp }
}

export const addHomeTempFeed = (feeds: Feeds, knx: KnxLink, feed: string, schema: HomeTempRoomSchema): void => {
  const reading = knxTemp(`temp.${feed}`, knx.getDatapoint(schema.reading))

  if (schema.setpoint) {
    const setpoint = knxTemp(`temp.${feed}.setpoint`, knx.getDatapoint(schema.setpoint))
    feeds.addFeed(
      `home.temp.${feed}`,
      { reading, setpoint, indoorTempHistory },
      ({ reading, setpoint, indoorTempHistory }) => ({
        history: indoorTempHistory[schema.history],
        setpoint: setpoint.value.toFixed(1),
        ...reading,
      }),
    )
    return
  }

  feeds.addFeed(`home.temp.${feed}`, { reading, indoorTempHistory }, ({ reading, indoorTempHistory }) => ({
    history: indoorTempHistory[schema.history],
    ...reading,
  }))
}
