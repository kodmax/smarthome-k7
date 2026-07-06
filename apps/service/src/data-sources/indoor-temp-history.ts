import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'

type RoomTempHistory = Array<{
  hour: number
  value: number
}>

export type TempHistory = {
  bathroomFloor: RoomTempHistory
  livingroom: RoomTempHistory
  bathroom: RoomTempHistory
  bedroom: RoomTempHistory
}

type HistoryRecord = {
  reading_name: string
  hour: number
  value: number
}

const readingToHistory: Record<string, keyof TempHistory> = {
  bathroom_floor_temp: 'bathroomFloor',
  livingroom_temp: 'livingroom',
  bedroom_temp: 'bedroom',
  bathroom_temp: 'bathroom',
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
              reading_name,
              hour(timestamp) as hour,
              avg(reading_value) as value
              from readings
              where timestamp >= ?
                and reading_name in ('bathroom_floor_temp', 'bedroom_temp', 'livingroom_temp', 'bathroom_temp')
              group by reading_name, hour(timestamp)
              order by reading_name, hour(timestamp) ASC`,
        [DateTime.now().getDate()],
      )) as HistoryRecord[]

      const result: TempHistory = {
        bathroomFloor: [],
        livingroom: [],
        bedroom: [],
        bathroom: [],
      }

      for (const record of history) {
        const key = readingToHistory[record.reading_name]
        result[key].push({ hour: record.hour, value: record.value })
      }

      return result
    } finally {
      conn.release()
    }
  },
}
