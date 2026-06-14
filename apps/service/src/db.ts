import * as mariadb from 'mariadb'
import { config } from './config'

const pool = mariadb.createPool({ ...config.db })

export default pool
