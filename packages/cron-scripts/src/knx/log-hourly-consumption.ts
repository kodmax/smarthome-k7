#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { KnxLink } from 'js-knx'
import * as mariadb from 'mariadb'
import { fileURLToPath } from 'node:url'
import { dbConfig } from '#config/db'
import { requireEnv } from '#config/env'

const pool = mariadb.createPool(dbConfig())

export async function logHourlyConsumption(knx: KnxLink): Promise<void> {
  const now = new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  const db = await pool.getConnection()

  if (now % 3_600_000 > 180_000) {
    throw new Error('This script needs to be run in the first 3 minutes of an hour!')
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
    await db.end()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knx = new KnxLink(requireEnv('KNX_HOST'), { maxRetry: 3 })
  knx.on('error', err => console.error(err))
  knx.connect().then(async () => {
    try {
      await logHourlyConsumption(knx)
    } finally {
      await knx.disconnect()
    }

    process.exit(0)
  })
}
