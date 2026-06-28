import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'

type RoomTempHistory = Array<{
  hour: number
  value: number
  heating: boolean
}>

export type TempHistory = {
  bathroomFloor: RoomTempHistory
  livingroom: RoomTempHistory
  bathroom: RoomTempHistory
  bedroom: RoomTempHistory
}

type HistoryRecord = {
  hour: number
  bathroom_floor_temp: number
  bedroom_temp: number
  livingroom_temp: number
  bathroom_temp: number
  bathroom_floor_heating: boolean
  bedroom_heating: boolean
  livingroom_heating: boolean
  bathroom_heating: boolean
}

export const source: DataSourceDefinition<TempHistory> = {
  id: 'indoor-temp-history',
  cron: '*/5 * * * *',
  volatile: true,

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 5,

  script: async () => {
    const conn = await db.getConnection()
    try {
      const history = (await conn.query(
        `select
              hour(timestamp) as hour,
              avg(bathroom_floor_temp) as bathroom_floor_temp,
              avg(bedroom_temp) as bedroom_temp,
              avg(livingroom_temp) as livingroom_temp,
              avg(bathroom_temp) as bathroom_temp,
              max(bathroom_floor_heating) as bathroom_floor_heating,
              max(bedroom_heating) as bedroom_heating,
              max(livingroom_heating) as livingroom_heating,
              max(bathroom_heating) as bathroom_heating
              from indoor_air_condition where timestamp >= ?
              group by hour(timestamp)
              order by hour(timestamp) ASC`,
        [new DateTime().getDate()],
      )) as HistoryRecord[]

      return {
        bathroomFloor: history.map(record => ({
          hour: record.hour,
          value: record.bathroom_floor_temp,
          heating: record.bathroom_floor_heating,
        })),
        livingroom: history.map(record => ({
          hour: record.hour,
          value: record.livingroom_temp,
          heating: record.livingroom_heating,
        })),
        bedroom: history.map(record => ({
          hour: record.hour,
          value: record.bedroom_temp,
          heating: record.bedroom_heating,
        })),
        bathroom: history.map(record => ({
          hour: record.hour,
          value: record.bathroom_temp,
          heating: record.bathroom_heating,
        })),
      }
    } finally {
      conn.release()
    }
  },
}
