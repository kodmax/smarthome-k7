import { CacheAgeUnit, DataSource } from '@repo/feeds'
import DateTime from '../DateTime'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import type { Sql } from '@repo/db'

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

export class IndoorTempHistorySource extends DataSource<TempHistory> {
  @Inject('db')
  declare private db: Sql

  static getId() {
    return 'indoor-temp-history'
  }

  static getCron() {
    return '*/5 * * * *'
  }

  static isVolatile() {
    return true
  }

  static getCacheTTL() {
    return CacheAgeUnit.MINUTE * 5
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData() {
    const history = await observeDbQuery(
      'select',
      'readings',
      () =>
        this.db<HistoryRecord[]>`
        select
          reading_name,
          extract(hour from timestamp)::int as hour,
          avg(reading_value) as value
        from readings
        where timestamp >= ${DateTime.now().getDate()}
          and reading_name in ('bathroom_floor_temp', 'bedroom_temp', 'livingroom_temp', 'bathroom_temp')
        group by reading_name, extract(hour from timestamp)
        order by reading_name, extract(hour from timestamp) asc
      `,
    )

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
  }
}
