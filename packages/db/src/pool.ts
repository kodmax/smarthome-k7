import postgres from 'postgres'
import type { Sql } from 'postgres'
import { getDbConfig } from './config'

let sql: Sql | undefined

export const getSql = (): Sql => {
  if (sql === undefined) {
    const config = getDbConfig()
    sql = postgres({
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.database,
      transform: {
        undefined: null,
      },
    })
  }

  return sql
}

export const closeSql = async (): Promise<void> => {
  if (sql === undefined) {
    return
  }

  await sql.end()
  sql = undefined
}

export type { Sql } from 'postgres'
