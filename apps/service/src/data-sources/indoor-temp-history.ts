import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'

type RoomTempHistory = Array<{
  datetime: string
  value: number
  active: boolean
}>

type TempHistory = {
  bathroomFloor: RoomTempHistory
  livingroom: RoomTempHistory
  bathroom: RoomTempHistory
  bedroom: RoomTempHistory
}

type HistoryRecord = {
  timestamp: string
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
              timestamp, 
              bathroom_floor_temp, bedroom_temp, livingroom_temp, bathroom_temp,
              bathroom_floor_heating, bedroom_heating, livingroom_heating, bathroom_heating
              from indoor_air_condition where timestamp >= ?
              order by timestamp ASC`,
        [new DateTime().getDate()],
      )) as HistoryRecord[]

      return {
        bathroomFloor: history.map(record => ({
          datetime: record.timestamp,
          value: record.bathroom_floor_temp,
          active: record.bathroom_floor_heating,
        })),
        livingroom: history.map(record => ({
          datetime: record.timestamp,
          value: record.livingroom_temp,
          active: record.livingroom_heating,
        })),
        bedroom: history.map(record => ({
          datetime: record.timestamp,
          value: record.bedroom_temp,
          active: record.bedroom_heating,
        })),
        bathroom: history.map(record => ({
          datetime: record.timestamp,
          value: record.bathroom_temp,
          active: record.bathroom_heating,
        })),
      }
    } finally {
      conn.release()
    }
  },
}
