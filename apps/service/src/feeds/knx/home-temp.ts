import { Feeds } from '@repo/apollo-ws'
import type { KnxLink } from 'js-knx'
import { DPT_Value_Temp } from 'js-knx'
import { IndoorTempHistorySource, type TempHistory } from '@/data-sources'
import knxTemp from '@/data-sources/knx/temp'
import DateTime from '@/DateTime'

export type HomeTempRoomSchema = {
  history: keyof TempHistory
  reading: { address: string; DataType: typeof DPT_Value_Temp }
  setpoint?: { address: string; DataType: typeof DPT_Value_Temp }
}

export const addHomeTempFeed = (feeds: Feeds, knx: KnxLink, feed: string, schema: HomeTempRoomSchema): void => {
  const reading = knxTemp(`temp.${feed}`, knx.group(schema.reading))

  if (schema.setpoint) {
    const setpoint = knxTemp(`temp.${feed}.setpoint`, knx.group(schema.setpoint))
    feeds.addFeed(
      `home.temp.${feed}`,
      { reading, setpoint, indoorTempHistory: IndoorTempHistorySource },
      ({ reading, setpoint, indoorTempHistory }) => ({
        reading,
        history: {
          date: DateTime.now().getDate(),
          today: indoorTempHistory[schema.history],
        },
        setpoint: setpoint.value.toFixed(1),
      }),
    )
    return
  }

  feeds.addFeed(
    `home.temp.${feed}`,
    { reading, indoorTempHistory: IndoorTempHistorySource },
    ({ reading, indoorTempHistory }) => ({
      reading,
      history: {
        date: DateTime.now().getDate(),
        today: indoorTempHistory[schema.history],
      },
    }),
  )
}
