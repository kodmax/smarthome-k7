import * as mariadb from 'mariadb'
import { getDbConfig } from './config'

let pool: mariadb.Pool | undefined

export const getDbPool = (): mariadb.Pool => {
  if (pool === undefined) {
    pool = mariadb.createPool({ ...getDbConfig() })
  }

  return pool
}

export const closeDbPool = async (): Promise<void> => {
  if (pool === undefined) {
    return
  }

  await pool.end()
  pool = undefined
}
