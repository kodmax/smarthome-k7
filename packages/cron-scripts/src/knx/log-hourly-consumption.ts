#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { KnxLink } from 'js-knx'
import * as mariadb from 'mariadb'
import { dbConfig } from '#config/db'
import { requireEnv } from '#config/env'

const pool = mariadb.createPool(dbConfig())

KnxLink.connect(requireEnv('KNX_HOST'), { maxRetry: 3 }).then(async knx => {
  const now = new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  const db = await pool.getConnection()

  if (now % 3_600_000 > 60_000) {
    throw new Error('This script needs to be run in the first minute of an hour!')
  }

  try {
    const total = await knx.getDatapoint(knxSchema.home.energy.consumption.meterTotalReading).read()
    const prevHour = new Date(now - (now % 3_600_000) - 3_600_000)
    const thisHour = new Date(now - (now % 3_600_000))

    await db.query('insert into hourly_energy_readings (datetime, hour, hour_start_reading) values (?, ?, ?)', [
      thisHour.toISOString().substring(0, 19),
      thisHour.toISOString().substring(11, 19),
      total.value,
    ])
    await db.query('update hourly_energy_readings set hourly_consumption = ? - hour_start_reading where datetime = ?', [
      total.value,
      prevHour.toISOString().substring(0, 19),
    ])
  } finally {
    await knx.disconnect()
    await db.end()
  }

  process.exit(0)
})
